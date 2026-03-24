param(
  [string]$RepoRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$script:errorCount = 0
$script:warningCount = 0
$repoPath = (Resolve-Path -LiteralPath $RepoRoot).Path

function Add-Error {
  param([string]$Message)
  Write-Host "ERROR: $Message" -ForegroundColor Red
  $script:errorCount++
}

function Add-WarningMsg {
  param([string]$Message)
  Write-Host "WARN:  $Message" -ForegroundColor Yellow
  $script:warningCount++
}

function Get-FirstMatch {
  param(
    [string]$Text,
    [string]$Pattern
  )

  $m = [regex]::Match($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($m.Success) {
    return $m.Groups[1].Value
  }
  return $null
}

function Get-AllMatches {
  param(
    [string]$Text,
    [string]$Pattern
  )

  $matches = [regex]::Matches($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $values = @()
  foreach ($match in $matches) {
    $values += $match.Groups[1].Value
  }
  return ,@($values)
}

function Get-ExpectedCanonicalUrl {
  param(
    [string]$FilePath,
    [string]$RepoRootPath
  )

  $relative = (Get-RelativePath -BasePath $RepoRootPath -TargetPath $FilePath).Replace("\", "/")
  if ($relative -eq "index.html") {
    return "https://www.jobalchemist.tech/"
  }
  if ($relative.EndsWith("/index.html")) {
    $dir = $relative.Substring(0, $relative.Length - "/index.html".Length)
    return "https://www.jobalchemist.tech/$dir/"
  }
  return "https://www.jobalchemist.tech/$relative"
}

function Get-RelativePath {
  param(
    [string]$BasePath,
    [string]$TargetPath
  )

  $baseFull = (Resolve-Path -LiteralPath $BasePath).Path.TrimEnd("\")
  $targetFull = (Resolve-Path -LiteralPath $TargetPath).Path

  $baseUri = New-Object System.Uri(($baseFull + "\"))
  $targetUri = New-Object System.Uri($targetFull)
  $relativeUri = $baseUri.MakeRelativeUri($targetUri)
  return [System.Uri]::UnescapeDataString($relativeUri.ToString()).Replace("/", "\")
}

function Resolve-LocalPath {
  param(
    [string]$Value,
    [string]$PageDirectory,
    [string]$RepoRootPath
  )

  if ($Value -match '^(https?:|mailto:|tel:|data:|javascript:|//|#)') {
    return $null
  }

  $clean = (($Value -split '#')[0] -split '\?')[0]
  if ([string]::IsNullOrWhiteSpace($clean)) {
    return $null
  }

  if ($clean.StartsWith("/")) {
    $trimmed = $clean.TrimStart("/")
    return (Join-Path $RepoRootPath $trimmed)
  }

  return (Join-Path $PageDirectory $clean)
}

Write-Host "Running site readiness checks in $repoPath"

$htmlFiles = Get-ChildItem -Path $repoPath -Recurse -File -Filter *.html | Where-Object {
  $_.FullName -notmatch '\\\.codex\\'
}

if (-not $htmlFiles) {
  Add-Error "No HTML files found in repo."
}

$indexableCanonicalToDate = @{}
$indexableCanonicalToFile = @{}

foreach ($file in $htmlFiles) {
  $text = Get-Content -LiteralPath $file.FullName -Raw
  $relative = (Get-RelativePath -BasePath $repoPath -TargetPath $file.FullName).Replace("\", "/")

  $lang = Get-FirstMatch -Text $text -Pattern '<html[^>]*\blang="([^"]+)"'
  if (-not $lang) {
    Add-Error "$relative missing <html lang>."
  } elseif ($lang -ne "en-NZ") {
    Add-Error "$relative lang is '$lang' (expected en-NZ)."
  }

  $title = Get-FirstMatch -Text $text -Pattern '<title>\s*([^<]+?)\s*</title>'
  if (-not $title) {
    Add-Error "$relative missing <title>."
  }

  $metaDescription = Get-FirstMatch -Text $text -Pattern '<meta[^>]*name="description"[^>]*content="([^"]+)"'
  if (-not $metaDescription) {
    Add-Error "$relative missing meta description."
  }

  $canonical = Get-FirstMatch -Text $text -Pattern '<link[^>]*rel="canonical"[^>]*href="([^"]+)"'
  if (-not $canonical) {
    Add-Error "$relative missing canonical URL."
  } elseif ($canonical -notmatch '^https://www\.jobalchemist\.tech/') {
    Add-Error "$relative canonical must use https://www.jobalchemist.tech/."
  }

  $robots = Get-FirstMatch -Text $text -Pattern '<meta[^>]*name="robots"[^>]*content="([^"]+)"'
  $isNoIndex = $false
  if ($robots -and $robots.ToLower().Contains("noindex")) {
    $isNoIndex = $true
  }

  $expectedCanonical = Get-ExpectedCanonicalUrl -FilePath $file.FullName -RepoRootPath $repoPath
  if ($canonical -and -not $isNoIndex -and $canonical -ne $expectedCanonical) {
    Add-WarningMsg "$relative canonical differs from expected path URL ($expectedCanonical)."
  }

  if (-not $isNoIndex) {
    $requiredMetaPatterns = @{
      "og:title" = '<meta[^>]*property="og:title"[^>]*content="([^"]+)"'
      "og:description" = '<meta[^>]*property="og:description"[^>]*content="([^"]+)"'
      "og:url" = '<meta[^>]*property="og:url"[^>]*content="([^"]+)"'
      "og:image" = '<meta[^>]*property="og:image"[^>]*content="([^"]+)"'
      "twitter:card" = '<meta[^>]*name="twitter:card"[^>]*content="([^"]+)"'
      "twitter:title" = '<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"'
      "twitter:description" = '<meta[^>]*name="twitter:description"[^>]*content="([^"]+)"'
      "twitter:image" = '<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"'
    }

    foreach ($key in $requiredMetaPatterns.Keys) {
      $value = Get-FirstMatch -Text $text -Pattern $requiredMetaPatterns[$key]
      if (-not $value) {
        Add-Error "$relative missing required tag: $key."
      }
    }
  }

  $ogUrl = Get-FirstMatch -Text $text -Pattern '<meta[^>]*property="og:url"[^>]*content="([^"]+)"'
  if ($ogUrl -and $canonical -and $ogUrl -ne $canonical -and -not $isNoIndex) {
    Add-WarningMsg "$relative has og:url that differs from canonical."
  }

  $ogUpdatedTime = Get-FirstMatch -Text $text -Pattern '<meta[^>]*property="og:updated_time"[^>]*content="([^"]+)"'
  $ogDate = $null
  if ($ogUpdatedTime) {
    if ($ogUpdatedTime -notmatch '^\d{4}-\d{2}-\d{2}T') {
      Add-Error "$relative og:updated_time has invalid format."
    } else {
      $ogDate = $ogUpdatedTime.Substring(0, 10)
    }
  }

  $dateModifiedValues = @(Get-AllMatches -Text $text -Pattern '"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"')
  $dateModified = $null
  if ($dateModifiedValues.Count -gt 0) {
    $dateModified = $dateModifiedValues[0]
  }

  if ($dateModified -and $ogDate -and $dateModified -ne $ogDate) {
    Add-Error "$relative has mismatched dateModified ($dateModified) and og:updated_time ($ogDate)."
  }

  $resolvedDate = $null
  if ($dateModified) {
    $resolvedDate = $dateModified
  } elseif ($ogDate) {
    $resolvedDate = $ogDate
  }

  if (-not $isNoIndex -and $canonical) {
    $indexableCanonicalToFile[$canonical] = $relative
    if ($resolvedDate) {
      $indexableCanonicalToDate[$canonical] = $resolvedDate
    }
  }

  $pageDir = Split-Path -Path $file.FullName -Parent
  $refValues = Get-AllMatches -Text $text -Pattern '(?:href|src)\s*=\s*"([^"]+)"'
  foreach ($ref in $refValues) {
    $resolved = Resolve-LocalPath -Value $ref -PageDirectory $pageDir -RepoRootPath $repoPath
    if ($resolved -and -not (Test-Path -LiteralPath $resolved)) {
      Add-Error "$relative references missing path: $ref"
    }
  }

  $modalValues = Get-AllMatches -Text $text -Pattern 'data-image-modal\s*=\s*"([^"]+)"'
  foreach ($modalPath in $modalValues) {
    $resolvedModal = Resolve-LocalPath -Value $modalPath -PageDirectory $pageDir -RepoRootPath $repoPath
    if ($resolvedModal -and -not (Test-Path -LiteralPath $resolvedModal)) {
      Add-Error "$relative data-image-modal missing file: $modalPath"
    }
  }
}

$sitemapPath = Join-Path $repoPath "sitemap.xml"
$sitemapMap = @{}
$sitemapLastMods = @()

if (-not (Test-Path -LiteralPath $sitemapPath)) {
  Add-Error "Missing sitemap.xml."
} else {
  $sitemapText = Get-Content -LiteralPath $sitemapPath -Raw
  $urlMatches = [regex]::Matches($sitemapText, '<url>\s*<loc>([^<]+)</loc>[\s\S]*?<lastmod>([^<]+)</lastmod>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  foreach ($m in $urlMatches) {
    $loc = $m.Groups[1].Value.Trim()
    $lastmod = $m.Groups[2].Value.Trim()
    $sitemapMap[$loc] = $lastmod
    $sitemapLastMods += $lastmod
    if ($lastmod -notmatch '^\d{4}-\d{2}-\d{2}$') {
      Add-Error "sitemap.xml lastmod has invalid format for ${loc}: $lastmod"
    }
  }

  foreach ($canonical in $indexableCanonicalToFile.Keys) {
    if (-not $sitemapMap.ContainsKey($canonical)) {
      Add-Error "sitemap.xml missing indexable page: $canonical"
      continue
    }

    if ($indexableCanonicalToDate.ContainsKey($canonical)) {
      $pageDate = $indexableCanonicalToDate[$canonical]
      $sitemapDate = $sitemapMap[$canonical]
      if ($pageDate -ne $sitemapDate) {
        Add-WarningMsg "Date mismatch for ${canonical}: page=$pageDate sitemap=$sitemapDate"
      }
    }
  }
}

$llmsPath = Join-Path $repoPath "llms.txt"
$llmsDate = $null
$llmsUrls = @()

if (-not (Test-Path -LiteralPath $llmsPath)) {
  Add-Error "Missing llms.txt."
} else {
  $llmsText = Get-Content -LiteralPath $llmsPath -Raw
  $llmsDate = Get-FirstMatch -Text $llmsText -Pattern '## Last updated\s*\r?\n(\d{4}-\d{2}-\d{2})'
  if (-not $llmsDate) {
    Add-Error "llms.txt missing '## Last updated' date."
  }

  $llmsUrls = Get-AllMatches -Text $llmsText -Pattern '(https://www\.jobalchemist\.tech[^\s]+)'
  $llmsSet = @{}
  foreach ($url in $llmsUrls) {
    $llmsSet[$url] = $true
  }

  foreach ($canonical in $sitemapMap.Keys) {
    if (-not $llmsSet.ContainsKey($canonical)) {
      Add-WarningMsg "llms.txt canonical list missing sitemap URL: $canonical"
    }
  }

  if ($llmsDate) {
    $allDates = @()
    $allDates += $sitemapLastMods
    foreach ($d in $indexableCanonicalToDate.Values) {
      $allDates += $d
    }
    if ($allDates.Count -gt 0) {
      $latestDate = ($allDates | Sort-Object | Select-Object -Last 1)
      if ($llmsDate -lt $latestDate) {
        Add-WarningMsg "llms.txt date ($llmsDate) is older than latest metadata date ($latestDate)."
      }
    }
  }
}

$agentPath = Join-Path $repoPath "AGENT.md"
if (-not (Test-Path -LiteralPath $agentPath)) {
  Add-WarningMsg "AGENT.md missing at repo root."
}

$diffCheck = cmd /c "git diff --check 2>nul"
if ($diffCheck) {
  Add-Error "git diff --check reported whitespace issues.`n$diffCheck"
}

Write-Host ""
Write-Host "Validation complete: $script:errorCount error(s), $script:warningCount warning(s)."

if ($script:errorCount -gt 0) {
  exit 1
}

exit 0
