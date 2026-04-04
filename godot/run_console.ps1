# Run Godot's *console* build so stdout/stderr stay attached to this terminal.
# Also passes --log-file so a copy lands under debug_logs/ (gitignored) for sharing with Cursor/agents.
#
# Usage (from repo root or godot/):
#   .\godot\run_console.ps1                    # run main scene (windowed)
#   .\godot\run_console.ps1 -Editor            # open editor
#   .\godot\run_console.ps1 -Headless          # agent smoke: no window, exit after N frames
#   .\godot\run_console.ps1 -GodotConsole "D:\Godot\Godot_v4.6.2-stable_win64_console.exe"

param(
	[string] $GodotConsole = "C:\Program Files\Godot\Godot_v4.6.2-stable_win64_console.exe",
	[switch] $Editor,
	[switch] $Headless,
	[int] $QuitAfter = 8
)

$ErrorActionPreference = "Stop"
$proj = $PSScriptRoot
$logDir = Join-Path $proj "debug_logs"
$logFile = Join-Path $logDir "last_run.log"

if (-not (Test-Path $GodotConsole)) {
	throw "Godot console executable not found: $GodotConsole — download the console build or pass -GodotConsole."
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
if ($Headless) {
	$godotArgs += "--headless"
	$godotArgs += "--quit-after"
	$godotArgs += "$QuitAfter"
}

Write-Host "Log file: $logFile"
& $GodotConsole @godotArgs
exit $LASTEXITCODE
