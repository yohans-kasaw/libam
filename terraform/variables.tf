variable "libam-api-image-tag" {
  description = "The tag for the docker image (e.g., a git commit SHA)"
  type        = string
}

variable "region" {
  type        = string
  default = "me-west1"
}

variable "GOOSE_DBSTRING" {
  type      = string
  sensitive = true
}

variable "JWT_SIGNING_KEY" {
  type      = string
  sensitive = true
}

