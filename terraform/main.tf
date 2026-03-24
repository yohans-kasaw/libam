# TODO have the front end deployed and connected to also. 
# TODO have auth to access libam api 
# TODO bulding images in terraform is antipattern, it should be done on github actions
# TODO replace cloud sql built from modules. 

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

# account
resource "google_service_account" "libam-api-cloud-run" {
  account_id   = "libam-api-cloud-run"
  display_name = "Libam API Service Account"
}

# secret buckets
resource "google_secret_manager_secret" "dot-env" {
  secret_id = "dot-env"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret" "DB_PASSWORD" {
  secret_id = "DB_PASSWORD"
  replication {
    auto {
    }
  }
}

# Iam permisions 
resource "google_secret_manager_secret_iam_member" "DB_PASSWORD_secret_access" {
  secret_id = google_secret_manager_secret.DB_PASSWORD.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}

resource "google_secret_manager_secret_iam_member" "dot-env-secret-access" {
  secret_id = google_secret_manager_secret.dot-env.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}

resource "google_project_iam_member" "cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"

  depends_on = [module.libam_cloud_sql]

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

module "libam-api-cloud-run" {
  source  = "GoogleCloudPlatform/cloud-run/google//modules/v2"
  version = "~> 0.25"

  service_name                  = "libam-api"
  project_id                    = var.project_id
  location                      = var.region
  cloud_run_deletion_protection = false

  service_account = google_service_account.libam-api-cloud-run.email

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
          secret  = google_secret_manager_secret.DB_PASSWORD.secret_id
          version = "latest"
        }
      }

      volume_mounts = [
        {
          name       = "dot-env-volume"
          mount_path = "/secrets"
        }
      ]

    }
  ]

  volumes = [
    {
      name = "dot-env-volume"
      secret = {
        secret = google_secret_manager_secret.dot-env.secret_id
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
    module.libam_cloud_sql,
    google_secret_manager_secret_version.latest,
    google_secret_manager_secret_version.app-latest,
    google_secret_manager_secret_iam_member.dot-env-secret-access,
    google_secret_manager_secret_iam_member.DB_PASSWORD_secret_access,
    google_project_iam_member.cloud_sql_client,
  ]
}

# setting values of secrets 
resource "google_secret_manager_secret_version" "latest" {
  secret      = google_secret_manager_secret.DB_PASSWORD.id
  secret_data = module.libam_cloud_sql.generated_user_password

  depends_on = [module.libam_cloud_sql]
}

resource "google_secret_manager_secret_version" "app-latest" {
  secret      = google_secret_manager_secret.dot-env.id
  secret_data = file("${path.root}/../backend/.env.prod")
}
