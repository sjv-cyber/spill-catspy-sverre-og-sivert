# Creates "CatSpy (Play).lnk" on your Windows Desktop — double-click to run the game (no editor).
# Re-run after moving the repo or installing a different Godot version.

param(
	[string] $GodotExe = "C:\Program Files\Godot\Godot_v4.6.2-stable_win64.exe",
	[string] $ShortcutName = "CatSpy (Play).lnk"
)

$ErrorActionPreference = "Stop"
$projRoot = $PSScriptRoot
if (-not (Test-Path $GodotExe)) {
	throw "Godot not found: $GodotExe - pass -GodotExe or install Godot."
}

$desktop = [Environment]::GetFolderPath("Desktop")
$lnkPath = Join-Path $desktop $ShortcutName

$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($lnkPath)
$sc.TargetPath = $GodotExe
$sc.Arguments = "--path `"$projRoot`""
$sc.WorkingDirectory = $projRoot
$sc.IconLocation = "$GodotExe,0"
$sc.Description = "CatSpy - run main scene (Godot)"
$sc.Save()

Write-Host "Created: $lnkPath"
