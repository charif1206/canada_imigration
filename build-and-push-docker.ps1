# Docker Build and Push Script
# This script builds all Docker images and pushes them to Docker Hub

param(
    [Parameter(Mandatory=$true)]
    [string]$DockerUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest"
)

Write-Host "Docker Build and Push Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

$projectRoot = $PSScriptRoot
$images = @(
    @{Name="backend"; Path="$projectRoot\backend"},
    @{Name="frontend"; Path="$projectRoot\frontend"},
    @{Name="admin"; Path="$projectRoot\admin"}
)

# Check if Docker is running
Write-Host "Checking Docker..." -NoNewline
try {
    docker info | Out-Null
    Write-Host " Running" -ForegroundColor Green
} catch {
    Write-Host " Docker is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Login to Docker Hub
Write-Host ""
Write-Host "Logging in to Docker Hub..." -ForegroundColor Cyan
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker login failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Building and pushing images..." -ForegroundColor Cyan
Write-Host ""

foreach ($image in $images) {
    $imageName = "$DockerUsername/canada-immigration-$($image.Name):$Tag"
    
    Write-Host "Building: $imageName" -ForegroundColor Yellow
    Write-Host "   Location: $($image.Path)" -ForegroundColor Gray
    
    # Build the image
    docker build -t $imageName $image.Path
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Build failed for $($image.Name)" -ForegroundColor Red
        continue
    }
    
    Write-Host "   Build successful" -ForegroundColor Green
    
    # Push the image
    Write-Host "   Pushing to Docker Hub..." -ForegroundColor Yellow
    docker push $imageName
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Push failed for $($image.Name)" -ForegroundColor Red
        continue
    }
    
    Write-Host "   Push successful" -ForegroundColor Green
    Write-Host ""
}

Write-Host "============================================================" -ForegroundColor Gray
Write-Host "All done!" -ForegroundColor Green
Write-Host ""
Write-Host "Your images are now on Docker Hub:" -ForegroundColor Cyan
foreach ($image in $images) {
    Write-Host "  - $DockerUsername/canada-immigration-$($image.Name):$Tag" -ForegroundColor White
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy to Railway: https://railway.app" -ForegroundColor White
Write-Host "2. Or deploy to your VPS using docker-compose" -ForegroundColor White
Write-Host "3. Or deploy to DigitalOcean App Platform" -ForegroundColor White
Write-Host ""
