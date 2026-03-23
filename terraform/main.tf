# TODO have the front end deployed and connected to also. 
# TODO have auth to access libam api 
# TODO bulding images in terraform is antipattern, it should be done on github actions
# TODO have cloud sql create here 

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

resource "google_secret_manager_secret" "app-env" {
  secret_id = "app-env"
  replication {
    auto {
    }
  }
}

resource "google_secret_manager_secret_version" "app-latest" {
  secret      = google_secret_manager_secret.app-env.id
  secret_data = file("${path.root}/../backend/.env.prod")
}

resource "google_secret_manager_secret_iam_member" "app-env-secret-access" {
  secret_id = google_secret_manager_secret.app-env.id
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

      volume_mounts {
        name = "app-env-volume"
        mount_path = "/secrets"
      }
    }

    volumes {
      name = "app-env-volume"
      secret {
        secret = google_secret_manager_secret.app-env.secret_id

        items {
          version = "latest"
          path    = ".env"
        }
      }
    }

    scaling {
      min_instance_count = 1
      max_instance_count = 1
    }
  }

  depends_on = [
    docker_registry_image.publish-images,
    google_secret_manager_secret_iam_member.app-env-secret-access,
  ]
}


resource "google_cloud_run_v2_service_iam_member" "noauth" {
  project  = google_cloud_run_v2_service.libam-api.project
  location = google_cloud_run_v2_service.libam-api.location
  name     = google_cloud_run_v2_service.libam-api.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
