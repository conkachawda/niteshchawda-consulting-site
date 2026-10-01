# Regenerate only the CSS/JS loaded by the personal portfolio; originals stay editable.
# Requires Node.js/npm. npx caches the pinned official package outside this repository.
$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $siteRoot
try {
    $sources = @(
        'assets/portfolio.css', 'assets/enhancements.css',
        'assets/roadmap.css', 'assets/global-map.css',
        'assets/portfolio.js', 'assets/enhancements.js',
        'assets/roadmap.js', 'assets/global-map.js'
    )
    & npx.cmd --yes esbuild@0.25.10 @sources --minify --charset=utf8 --legal-comments=inline --outdir=assets --out-extension:.js=.min.js --out-extension:.css=.min.css
    if ($LASTEXITCODE -ne 0) { throw 'Asset minification failed.' }
} finally {
    Pop-Location
}
