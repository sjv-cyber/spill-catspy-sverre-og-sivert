# Godot asset copies

PNG sources are duplicated from the repo root for `res://` import:

- `backgrounds/` ← `../../assets/backgrounds/*.png`
- `sprites/` ← `../../assets/sprites/*.png`
- `ui/` ← `../../assets/ui/title_screen.png` (Phaser and Godot title art)

After updating art at repo root, re-copy:

```powershell
Copy-Item ..\..\assets\backgrounds\*.png .\backgrounds\ -Force
Copy-Item ..\..\assets\sprites\*.png .\sprites\ -Force
Copy-Item ..\..\assets\ui\title_screen.png .\ui\ -Force
```

Godot generates `.import` files on first open — commit them if your team wants zero first-run friction.
