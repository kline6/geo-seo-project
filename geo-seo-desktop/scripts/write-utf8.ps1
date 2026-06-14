param(
  [Parameter(Mandatory=$true)][string]$Path,
  [Parameter(Mandatory=$true)][string]$Content,
  [switch]$WithBom
)

$encoding = New-Object System.Text.UTF8Encoding([bool]$WithBom)
[System.IO.File]::WriteAllText($Path, $Content, $encoding)