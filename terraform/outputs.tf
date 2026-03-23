output "live_url" {
  value = google_cloud_run_v2_service.libam-api.uri
}

output "cloud-qsl-user-name"{
  value = google_sql_user.cloud-run.name
}
