terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 7.24.0"
    }
  }
}

provider "google" {
  project = "libam-terraform"
  region  = "me-west1"
}
