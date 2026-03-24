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

resource "google_service_account" "libam-api-cloud-run" {
  account_id   = "libam-api-cloud-run"
  display_name = "Libam API Service Account"
}

resource "random_password" "DB_PASSWORD" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "google_secret_manager_secret" "DB_PASSWORD" {
  secret_id = "DB_PASSWORD"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret_version" "latest" {
  secret      = google_secret_manager_secret.DB_PASSWORD.id
  secret_data = random_password.DB_PASSWORD.result
}

resource "google_secret_manager_secret_iam_member" "DB_PASSWORD_secret_access" {
  secret_id = google_secret_manager_secret.DB_PASSWORD.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}

resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.libam.name
  password = random_password.DB_PASSWORD.result
}

# database 
resource "google_sql_database_instance" "libam" {
  name             = "libam"
  database_version = "POSTGRES_18"
  region           = var.region

  deletion_protection = true

  settings {
    edition = "ENTERPRISE"
    tier    = "db-f1-micro"

    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_secret_manager_secret" "dot-env" {
  secret_id = "don-env"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret_version" "app-latest" {
  secret      = google_secret_manager_secret.dot-env.id
  secret_data = file("${path.root}/../backend/.env.prod")
}

resource "google_secret_manager_secret_iam_member" "dot-env-secret-access" {
  secret_id = google_secret_manager_secret.dot-env.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
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
        DB_HOST = "/cloudsql/${google_sql_database_instance.libam.connection_name}"
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
        instances = [google_sql_database_instance.libam.connection_name]
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
    google_secret_manager_secret_iam_member.dot-env-secret-access,
    google_secret_manager_secret_iam_member.DB_PASSWORD_secret_access,
    google_project_iam_member.cloud_sql_client,

    # Add these two lines so Cloud Run waits for the actual secret data to exist!
    google_secret_manager_secret_version.latest,
    google_secret_manager_secret_version.app-latest
  ]
}

resource "google_project_iam_member" "cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}
