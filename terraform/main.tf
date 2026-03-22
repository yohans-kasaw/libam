# TODO bulding images in terraform is antipattern, it should be done on github actions
# TODO have the front end deployed and connected to also. 
# TODO have auth to access libam api 
# TODO have cloud sql create here 
# TODO find a way to have all variables in one instead of definig theme one by one 
# TODO have tfvariables
# TODO change to secrets, does it redeplay, check and improve.

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
  project = "libam-terraform"
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

resource "google_secret_manager_secret" "GOOSE_DBSTRING" {
  secret_id = "GOOSE_DBSTRING"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret_version" "GOOSE_DBSTRING" {
  secret      = google_secret_manager_secret.GOOSE_DBSTRING.id
  secret_data = var.GOOSE_DBSTRING
}

resource "google_secret_manager_secret_iam_member" "goose_secret_access" {
  secret_id = google_secret_manager_secret.GOOSE_DBSTRING.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}


resource "google_secret_manager_secret" "JWT_SIGNING_KEY" {
  secret_id = "JWT_SIGNING_KEY"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret_version" "JWT_SIGNING_KEY" {
  secret      = google_secret_manager_secret.JWT_SIGNING_KEY.id
  secret_data = var.JWT_SIGNING_KEY
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_access" {
  secret_id = google_secret_manager_secret.JWT_SIGNING_KEY.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.libam-api-cloud-run.email}"
}

resource "google_cloud_run_v2_service" "libam-api" {
  name                = "libam-api"
  location            = var.region
  deletion_protection = false

  template {
    service_account = google_service_account.libam-api-cloud-run.email

    containers {
      image = docker_image.libam-api-image.name

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name = "GOOSE_DBSTRING"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.GOOSE_DBSTRING.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SIGNING_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.JWT_SIGNING_KEY.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "GOOSE_MIGRATION_DIR"
        value = "./migrations"
      }

      env {
        name  = "GOOSE_DRIVER"
        value = "postgres"
      }
    }

    scaling {
      min_instance_count = 1
      max_instance_count = 1
    }
  }

  depends_on = [
    docker_registry_image.publish-images,
    google_secret_manager_secret_iam_member.jwt_secret_access,
    google_secret_manager_secret_iam_member.goose_secret_access
  ]
}


resource "google_cloud_run_v2_service_iam_member" "noauth" {
  project  = google_cloud_run_v2_service.libam-api.project
  location = google_cloud_run_v2_service.libam-api.location
  name     = google_cloud_run_v2_service.libam-api.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
