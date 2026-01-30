# سكربت نسخ احتياطي لقاعدة بيانات PostgreSQL
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "backup_$timestamp.sql"
$env:PGPASSWORD = "password"
pg_dump -U postgres -h localhost -F c -b -v -f $backupFile qalaah
Write-Host "Backup saved to $backupFile"
