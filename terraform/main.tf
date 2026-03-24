# TODO have the front end deployed and connected to also. 
# TODO have auth to access libam api 
# TODO bulding images in terraform is antipattern, it should be done on github actions

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.24.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "docker" {
  registry_auth {
    address = "${var.region}-docker.pkg.dev"
  }
}

resource "google_artifact_registry_repository" "docker-repo" {
  location      = var.region
  repository_id = "docker-repo"
  format        = "DOCKER"
}

resource "docker_image" "libam-api-image" {
  name = "${var.region}-docker.pkg.dev/libam-terraform/docker-repo/libam-api:${var.libam-api-image-tag}"
  build {
    context = "${path.root}/../backend/"
  }
  depends_on = [google_artifact_registry_repository.docker-repo]
}

resource "docker_registry_image" "publish-images" {
  name          = docker_image.libam-api-image.name
  keep_remotely = true

  depends_on = [docker_image.libam-api-image]
}

module "service_account" {
  source     = "terraform-google-modules/service-accounts/google"
  version    = "~> 4.0"
  project_id = var.project_id

  names        = ["libam-api-cloud-run"]
  display_name = "Libam API Service Account"

  project_roles = [
    "${var.project_id}=>roles/cloudsql.client"
  ]
}

module "libam_cloud_sql" {
  source           = "terraform-google-modules/sql-db/google//modules/postgresql"
  version          = "~> 28.0"
  name             = "libam"
  database_version = "POSTGRES_18"
  project_id       = var.project_id
  region           = var.region

  tier                        = "db-f1-micro"
  edition                     = "ENTERPRISE"
  deletion_protection         = true
  deletion_protection_enabled = true

  disk_size       = 10
  disk_type       = "PD_SSD"
  disk_autoresize = true
  user_name       = "postgres"

  ip_configuration = {
    ipv4_enabled = true
  }
}

module "secret-manager" {
  source     = "GoogleCloudPlatform/secret-manager/google"
  version    = "~> 0.9"
  project_id = var.project_id

  secrets = [
    {
      name        = "DB_PASSWORD"
      secret_data = module.libam_cloud_sql.generated_user_password
    },
    {
      name        = "dot_env_prod_file"
      secret_data = file("${path.root}/../backend/.env.prod")
    }
  ]

  depends_on = [module.libam_cloud_sql]
}

module "secret_manager_iam" {
  source  = "terraform-google-modules/iam/google//modules/secret_manager_iam"
  version = "~> 8.1"

  project = var.project_id
  secrets = ["dot_env_prod_file", "DB_PASSWORD"]

  bindings = {
    "roles/secretmanager.secretAccessor" = [
      "serviceAccount:${module.service_account.email}"
    ]
  }

  depends_on = [module.secret-manager]
}

module "libam-api-cloud-run" {
  source  = "GoogleCloudPlatform/cloud-run/google//modules/v2"
  version = "~> 0.25"

  service_name                  = "libam-api"
  project_id                    = var.project_id
  location                      = var.region
  cloud_run_deletion_protection = false

  service_account = module.service_account.email

  containers = [
    {
      container_image = docker_image.libam-api-image.name
      resources = {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env_vars = {
        DB_HOST = "/cloudsql/${module.libam_cloud_sql.instance_connection_name}"
      }

      env_secret_vars = {
        DB_PASSWORD = {
          secret  = "DB_PASSWORD"
          version = "latest"
        }
      }

      volume_mounts = [
        {
          name       = "dot_env_prod_file_volume"
          mount_path = "/secrets"
        }
      ]

    }
  ]

  volumes = [
    {
      name = "dot_env_prod_file_volume"
      secret = {
        secret = "dot_env_prod_file"
        items = {
          version = "latest"
          path    = ".env"
        }
      }
    },
    {
      name = "cloudsql"
      cloud_sql_instance = {
        instances = [module.libam_cloud_sql.instance_connection_name]
      }
    }
  ]


  members = ["allUsers"]

  template_annotations = {
    "autoscaling.knative.dev/minScale" = "1"
    "autoscaling.knative.dev/maxScale" = "1"
  }

  depends_on = [
    docker_registry_image.publish-images,
    module.secret_manager_iam,
  ]
}

# Move the Service Account
moved {
  from = google_service_account.libam-api-cloud-run
  to   = module.service_account.google_service_account.service_accounts["libam-api-cloud-run"]
}

# Move the DB_PASSWORD Secret
moved {
  from = google_secret_manager_secret.DB_PASSWORD
  to   = module.secret-manager.google_secret_manager_secret.secrets["DB_PASSWORD"]
}

# Move the dot-env Secret
moved {
  from = google_secret_manager_secret.dot-env
  to   = module.secret-manager.google_secret_manager_secret.secrets["dot_env_prod_file"]
}

