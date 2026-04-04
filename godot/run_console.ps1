# Run Godot's *console* build so stdout/stderr stay attached to this terminal.
# Also passes --log-file so a copy lands under debug_logs/ (gitignored) for sharing with Cursor/agents.
#
# Usage (from repo root or godot/):
#   .\godot\run_console.ps1
#   .\godot\run_console.ps1 -Editor
#   .\godot\run_console.ps1 -GodotConsole "D:\Godot\Godot_v4.6.2-stable_win64_console.exe"

param(
	[string] $GodotConsole = "C:\Program Files\Godot\Godot_v4.6.2-stable_win64_console.exe",
	[switch] $Editor
)

$ErrorActionPreference = "Stop"
$proj = $PSScriptRoot
$logDir = Join-Path $proj "debug_logs"
$logFile = Join-Path $logDir "last_run.log"

if (-not (Test-Path $GodotConsole)) {
	Write-Error "Godot console executable not found: $GodotConsole`nDownload the console build or pass -GodotConsole."
}

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$godotArgs = @(
	"--path", $proj,
	"--verbose",
	"--log-file", $logFile
)
if ($Editor) {
	$godotArgs += "--editor"
}

Write-Host "Log file: $logFile"
& $GodotConsole @godotArgs
