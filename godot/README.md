# CatSpy — Godot 4.2+ rebuild

## For the family (who edits what)

- **You invent rooms and story** in **JSON** under `godot/data/rooms/` (and the shared copies under repo `assets/rooms/`). Same idea as always: tile maps, spawns, exits, and text fields in those files — no need to learn the Godot editor for level content.
- **Agents and programmers** change **GDScript**, **scenes** (`.tscn`), shaders, and wiring under `godot/` when behavior or structure needs to match the docs.
- **How to play:** open this folder in Godot and press **F5**, or use the **CatSpy (Play)** desktop shortcut from `godot/create_desktop_shortcut.ps1` (see below). In-game: move with **A/D** or arrows, jump with **Space** / **W** / **Up**, **T** to transform, **Esc** to pause in a room.

## Engine pin

Use **Godot 4.2 or newer** (4.x stable). Open this folder as the project root (`project.godot` lives here).

## First open

1. Open Godot → **Import** → select `godot/project.godot`.
2. Let the editor generate `.import` files for PNGs under `assets/`.
3. Run (**F5**) or play the main scene.

## Desktop shortcut (Windows)

Double-click **`CatSpy (Play)`** on the Desktop after running once:

```powershell
.\godot\create_desktop_shortcut.ps1
```

Uses `Godot_*_win64.exe` (not the console build). Pass **`-GodotExe "...\Godot_....exe"`** if your install path differs.

## Controls

| Action | Keys |
|--------|------|
| Move | A/D or arrows |
| Jump | Space / W / Up |
| Transform | T |
| Pause | Esc (in room) |
| Debug next room | F1 |

## Flow

**Title** → **SPACE / ENTER** → **RoomRoot** loads `Game.current_room_id` (default `room_cell_01` from manifest). Forward **exit** `Area2D` loads `next_room_id`. **Detection** (guards / cameras) → **Game Over** → title.

## Data

- Room JSON + `manifest.json`: `data/rooms/` (copies of repo root `assets/rooms/`). Re-sync after editing Phaser data:

```powershell
Copy-Item ..\assets\rooms\*.json -Destination .\data\rooms\ -Force
```

## Room contract

See [docs/contracts/godot-room-runtime.md](../docs/contracts/godot-room-runtime.md).

## Console build (Windows) — logs you can copy to Cursor

Godot ships two Windows executables:

| Binary | Use |
|--------|-----|
| `Godot_*_win64.exe` | Normal GUI; **no** attached console (prints are easy to miss). |
| `Godot_*_win64_console.exe` | **Same engine**, but **stdout/stderr** go to the terminal you started it from. |

**Leverage that** when you want errors, `print()`, and engine messages in a window you can scroll, pipe, or save:

1. Open **PowerShell** in the repo (or any terminal).
2. Run the helper (defaults to `C:\Program Files\Godot\..._console.exe`; override with `-GodotConsole` if needed):

```powershell
.\godot\run_console.ps1              # runs main scene (Title) — output in this terminal
.\godot\run_console.ps1 -Editor      # opens the editor — useful for script parse errors on load
.\godot\run_console.ps1 -Headless    # no window; exits after 8 frames (override: `-QuitAfter 30`)
```

The script also passes **`--log-file`** so everything is mirrored to **`godot/debug_logs/last_run.log`** (gitignored). You can paste that file into chat or leave it for an agent to read.

**Manual one-liner** (same idea):

```powershell
& "C:\Program Files\Godot\Godot_v4.6.2-stable_win64_console.exe" `
  --path "C:\path\to\repo\godot" --verbose --log-file "C:\path\to\repo\godot\debug_logs\last_run.log"
```

**Note:** Parser/type errors in scripts still surface in the **Script** panel when using the editor; the console build mainly helps with **runtime** logs, engine warnings, and anything printed to stderr. For a quick non-interactive load check:

```powershell
& "...\Godot_*_console.exe" --path .\godot --headless --verbose --quit-after 3 --log-file .\godot\debug_logs\headless.log
```
