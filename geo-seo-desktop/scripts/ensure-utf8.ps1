param(
  [Parameter(Mandatory=$true)][string]$Path,
  [switch]$Force
)

if (!(Test-Path $Path)) {
  throw "File not found: $Path"
}

$bytes = [System.IO.File]::ReadAllBytes($Path)
$hasBom = ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
$text = [System.IO.File]::ReadAllText($Path)
$hasReplacement = $text.Contains([char]0xFFFD)

if ($Force -or $hasBom -or $hasReplacement) {
  $cleanText = if ($hasReplacement) { $text.Replace([char]0xFFFD, '?') } else { $text }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $cleanText, $utf8NoBom)
}

[PSCustomObject]@{
  File = $Path
  HadBom = $hasBom
  HadReplacementChar = $hasReplacement
}