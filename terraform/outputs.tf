output "all_cloud_run_outputs" {
  description = "Every output from the Cloud Run module"
  value       = module.libam-api-cloud-run
  sensitive   = true
}

output "all_cloud_qsl_outputs" {
  description = "Every output from the Cloud Run module"
  value       = module.libam_cloud_sql
  sensitive   = true
}
