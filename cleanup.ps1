# Clean up unused files
Write-Host "🧹 Cleaning up unused files..." -ForegroundColor Cyan

# Remove .md documentation files (keeping only README.md in root)
$mdFiles = @(
    "DEPLOYMENT_CHECKLIST.md",
    "DEPLOYMENT_URLS.md",
    "DOCKER_DEPLOYMENT_GUIDE.md",
    "RAILWAY_DEPLOYMENT.md",
    "RENDER_FIX.md",
    "VERCEL_DEPLOYMENT_STEPS.md"
)

foreach ($file in $mdFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Remove test/diagnostic scripts
$testFiles = @(
    "test-backend.ps1",
    "test-docker-local.ps1",
    "check-deployment.ps1"
)

foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Remove unused backend files
$backendFiles = @(
    "backend\create-admin.sh",
    "backend\list-admins.js",
    "backend\res\node.js"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Remove .env.example if exists (we have .env.production)
if (Test-Path ".env.example") {
    Remove-Item ".env.example" -Force
    Write-Host "  ✓ Removed .env.example" -ForegroundColor Green
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes with: git status" -ForegroundColor Gray
Write-Host "2. Commit the cleanup: git add -A && git commit -m 'Clean up unused documentation and test files'" -ForegroundColor Gray
Write-Host "3. Push changes: git push" -ForegroundColor Gray
