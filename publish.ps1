#!/usr/bin/env pwsh
# Builds the static export and packages it into vawe-site.zip
# for upload to public_html/ on domains.co.za reseller hosting.

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$zipPath = Join-Path $PSScriptRoot 'vawe-site.zip'
$outPath = Join-Path $PSScriptRoot 'out'

Write-Host '==> Building static export...' -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }

if (-not (Test-Path $outPath)) { throw "Build did not produce '$outPath'." }

Write-Host '==> Packaging out/ into vawe-site.zip...' -ForegroundColor Cyan
if (Test-Path $zipPath) { Remove-Item $zipPath }
Push-Location $outPath
try {
    tar.exe -a -cf $zipPath *
    if ($LASTEXITCODE -ne 0) { throw 'tar failed to create zip.' }
} finally {
    Pop-Location
}

$size = [math]::Round((Get-Item $zipPath).Length / 1KB, 1)
Write-Host ''
Write-Host "[OK] vawe-site.zip ready ($size KB)" -ForegroundColor Green
Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host '  1. Open cPanel File Manager -> public_html/'
Write-Host '  2. Delete the old _next/ folder (File Manager can now handle it)'
Write-Host '  3. Upload vawe-site.zip'
Write-Host '  4. Select the zip -> Extract -> destination /public_html'
Write-Host '  5. Delete the zip'
Write-Host '  6. Hard-reload https://vawes.site (Ctrl+Shift+R) to verify'
