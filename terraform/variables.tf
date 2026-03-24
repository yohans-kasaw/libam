variable "libam-api-image-tag" {
  description = "The tag for the docker image (e.g., a git commit SHA)"
  type        = string
  default = "latest"
}
variable "project_id" {
  description = "Your Google Cloud Project ID"
  type        = string
  default     = "libam-terraform"
}

variable "region" {
  description = "Your Google Cloud Region"
  type        = string
  default = "me-west1"
}
