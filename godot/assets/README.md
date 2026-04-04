# Godot asset copies

PNG sources are duplicated from the repo root for `res://` import:

- `backgrounds/` ← `../../assets/backgrounds/*.png`
- `sprites/` ← `../../assets/sprites/*.png`

After updating art at repo root, re-copy:

```powershell
Copy-Item ..\..\assets\backgrounds\*.png .\backgrounds\ -Force
Copy-Item ..\..\assets\sprites\*.png .\sprites\ -Force
```

Godot generates `.import` files on first open — commit them if your team wants zero first-run friction.
