# Test Backend Connectivity

Write-Host "Testing Backend on Render..." -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://canada-imigration.onrender.com"

# Test 1: Root endpoint
Write-Host "1. Testing root endpoint: $backendUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $backendUrl -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Health check endpoint
Write-Host "2. Testing health endpoint: $backendUrl/health" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: API base endpoint
Write-Host "3. Testing API endpoint: $backendUrl/api" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Register endpoint
Write-Host "4. Testing register endpoint: $backendUrl/clients/auth/register" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/clients/auth/register" -Method GET -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Diagnosis:" -ForegroundColor Cyan
Write-Host "If all tests show 404, your backend might not be deployed correctly on Render." -ForegroundColor Yellow
Write-Host "Check your Render dashboard at: https://dashboard.render.com/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected behavior:" -ForegroundColor White
Write-Host "- Root (/) should return NestJS response or redirect" -ForegroundColor Gray
Write-Host "- /health or /api should return 200 OK" -ForegroundColor Gray
Write-Host "- /clients/auth/register should accept POST requests" -ForegroundColor Gray
