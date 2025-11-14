# Quick Docker Test Script
# Tests your Docker setup locally before deploying

Write-Host "🐳 Docker Local Test" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$projectRoot = "C:\Users\InfoBulles\Desktop\real progect\canada_imigration"

# Check Docker
Write-Host "1. Checking Docker..." -NoNewline
try {
    docker info | Out-Null
    Write-Host " ✅" -ForegroundColor Green
} catch {
    Write-Host " ❌ Docker not running" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check .env file
Write-Host "2. Checking .env file..." -NoNewline
if (Test-Path "$projectRoot\.env") {
    Write-Host " ✅" -ForegroundColor Green
    
    # Check if .env has default values
    $envContent = Get-Content "$projectRoot\.env" -Raw
    if ($envContent -match "your_secure_password_here" -or 
        $envContent -match "your_super_secret_jwt_key") {
        Write-Host "   ⚠️  Warning: .env still has default values" -ForegroundColor Yellow
        Write-Host "   Edit .env before deploying to production" -ForegroundColor Yellow
    }
} else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    Write-Host "   Run: Copy-Item .env.example .env" -ForegroundColor Yellow
    exit 1
}

# Check docker-compose.yml
Write-Host "3. Checking docker-compose.yml..." -NoNewline
if (Test-Path "$projectRoot\docker-compose.yml") {
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "✅ Everything looks good!" -ForegroundColor Green
Write-Host ""
Write-Host "Start your application locally:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  cd `"$projectRoot`"" -ForegroundColor White
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "Then visit:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://localhost:3001" -ForegroundColor White
Write-Host "  Admin Panel: http://localhost:3002" -ForegroundColor White
Write-Host "  Backend API: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Create admin user:" -ForegroundColor Cyan
Write-Host "  docker-compose exec backend node create-admin-direct.js" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Cyan
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "Stop everything:" -ForegroundColor Cyan
Write-Host "  docker-compose down" -ForegroundColor White
Write-Host ""
