# Quick Deployment Script
# Run this to check if you're ready to deploy

Write-Host "🚀 Canada Immigration App - Deployment Readiness Check" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$allGood = $true

# Check 1: .env file exists
Write-Host "Checking for .env file..." -NoNewline
if (Test-Path ".env") {
    Write-Host " ✅ Found" -ForegroundColor Green
} else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    Write-Host "  → Run: Copy-Item .env.example .env" -ForegroundColor Yellow
    $allGood = $false
}

# Check 2: Docker is running
Write-Host "Checking Docker Desktop..." -NoNewline
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Running" -ForegroundColor Green
    } else {
        Write-Host " ❌ Not running" -ForegroundColor Red
        Write-Host "  → Start Docker Desktop" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host " ❌ Not installed" -ForegroundColor Red
    Write-Host "  → Install Docker Desktop from docker.com" -ForegroundColor Yellow
    $allGood = $false
}

# Check 3: Git repository
Write-Host "Checking Git repository..." -NoNewline
if (Test-Path ".git") {
    Write-Host " ✅ Initialized" -ForegroundColor Green
} else {
    Write-Host " ⚠️ Not initialized" -ForegroundColor Yellow
    Write-Host "  → Run: git init" -ForegroundColor Yellow
}

# Check 4: Node modules
Write-Host "Checking dependencies..." -NoNewline
$missingDeps = 0
if (-not (Test-Path "backend/node_modules")) { $missingDeps++ }
if (-not (Test-Path "frontend/node_modules")) { $missingDeps++ }
if (-not (Test-Path "admin/node_modules")) { $missingDeps++ }

if ($missingDeps -eq 0) {
    Write-Host " ✅ All installed" -ForegroundColor Green
} else {
    Write-Host " ⚠️ Missing in $missingDeps folder(s)" -ForegroundColor Yellow
    Write-Host "  → Docker will install them automatically" -ForegroundColor Yellow
}

# Check 5: .env has been modified
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "your_secure_password_here" -or 
        $envContent -match "your_super_secret_jwt_key_change_this_in_production") {
        Write-Host "Checking .env configuration..." -ForegroundColor Yellow -NoNewline
        Write-Host " ⚠️ Still has default values" -ForegroundColor Yellow
        Write-Host "  → Edit .env and change passwords and JWT_SECRET" -ForegroundColor Yellow
        $allGood = $false
    } else {
        Write-Host "Checking .env configuration..." -NoNewline
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

if ($allGood) {
    Write-Host "🎉 READY TO DEPLOY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test locally: docker-compose up -d" -ForegroundColor White
    Write-Host "2. Visit: http://localhost:3001 (frontend)" -ForegroundColor White
    Write-Host "3. Visit: http://localhost:3002 (admin)" -ForegroundColor White
    Write-Host "4. Create admin: docker-compose exec backend node create-admin-direct.js" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Read DEPLOYMENT_CHECKLIST.md for full guide" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ ACTION REQUIRED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Fix the issues above, then run this script again." -ForegroundColor White
    Write-Host ""
    Write-Host "Quick fixes:" -ForegroundColor Cyan
    Write-Host "• Create .env: Copy-Item .env.example .env" -ForegroundColor White
    Write-Host "• Edit .env: notepad .env" -ForegroundColor White
    Write-Host "• Start Docker: Start 'Docker Desktop' from Start Menu" -ForegroundColor White
}

Write-Host ""
