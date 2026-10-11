$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "=====================================================================" -ForegroundColor Amber
Write-Host "   A DAY BACK THEN - AUTOMATION DASHBOARD & REMOTE ACCESS" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Amber

# Detect local LAN IP
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -notmatch 'Loopback|vEthernet' -and $_.IPAddress -notlike '169.254*' -and $_.IPAddress -like '192.168*'
} | Select-Object -First 1 -ExpandProperty IPAddress)

if (-not $localIp) {
    $localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.InterfaceAlias -notmatch 'Loopback|vEthernet' -and $_.IPAddress -notlike '169.254*'
    } | Select-Object -First 1 -ExpandProperty IPAddress)
}
if (-not $localIp) { $localIp = "127.0.0.1" }

# Start Next.js dashboard process
Write-Host "`n[1/2] Starting Next.js Production Dashboard on port 3100..." -ForegroundColor Yellow
$nextProcess = Start-Process -FilePath "npm" -ArgumentList "--prefix dashboard run start" -WorkingDirectory $root -PassThru -NoNewWindow

Start-Sleep -Seconds 3

# Start Cloudflare Tunnel for secure remote phone access
Write-Host "[2/2] Connecting Secure Cloudflare Tunnel for Outside-Home Mobile Access..." -ForegroundColor Yellow
$cloudflaredPath = Join-Path $root "tools\cloudflared.exe"

$tunnelUrl = $null
if (Test-Path $cloudflaredPath) {
    $tunnelLog = Join-Path $root "dashboard\data\tunnel.log"
    New-Item -ItemType Directory -Force -Path (Join-Path $root "dashboard\data") | Out-Null
    if (Test-Path $tunnelLog) { Remove-Item -Force $tunnelLog }

    $tunnelProcess = Start-Process -FilePath $cloudflaredPath -ArgumentList "tunnel --url http://localhost:3100" -WorkingDirectory $root -RedirectStandardError $tunnelLog -PassThru -NoNewWindow

    # Poll log for up to 10 seconds to extract trycloudflare.com URL
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Milliseconds 500
        if (Test-Path $tunnelLog) {
            $content = Get-Content $tunnelLog -Raw
            if ($content -match '(https://[a-zA-Z0-9-]+\.trycloudflare\.com)') {
                $tunnelUrl = $matches[1]
                break
            }
        }
    }
}

Write-Host "`n=====================================================================" -ForegroundColor Green
Write-Host "   DASHBOARD READY! ACCESS IT USING ANY OF THE LINKS BELOW:" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green

Write-Host "`n🏠 LOCAL PC BROWSER:" -ForegroundColor White
Write-Host "   http://localhost:3100" -ForegroundColor Cyan

Write-Host "`n📶 HOME WI-FI PHONE / TABLET:" -ForegroundColor White
Write-Host "   http://$($localIp):3100" -ForegroundColor Cyan

if ($tunnelUrl) {
    Write-Host "`n🌐 OUTSIDE-HOME MOBILE PHONE ACCESS (CELLULAR 4G/5G ANYWHERE):" -ForegroundColor White
    Write-Host "   $tunnelUrl" -ForegroundColor Yellow -BackgroundColor Black
    Write-Host "`n📲 HOW TO USE ON PHONE:" -ForegroundColor Gray
    Write-Host "   1. Open the yellow URL above on your phone browser (Safari or Chrome)."
    Write-Host "   2. Tap 'Add to Home Screen' to install as a full-screen PWA App."
    Write-Host "   3. Keep your PC running with this window open to access from anywhere."
} else {
    Write-Host "`nNote: Launch the mobile tunnel anytime inside the dashboard under 'Phone Remote'." -ForegroundColor Gray
}

Write-Host "`n=====================================================================" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the dashboard server." -ForegroundColor Gray

try {
    Wait-Process -Id $nextProcess.Id
} finally {
    if ($tunnelProcess -and -not $tunnelProcess.HasExited) {
        Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
