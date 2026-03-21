variable "libam-api-image-tag" {
  description = "The tag for the docker image (e.g., a git commit SHA)"
  type        = string
}

variable "region" {
  type        = string
  default = "me-west1"
}

