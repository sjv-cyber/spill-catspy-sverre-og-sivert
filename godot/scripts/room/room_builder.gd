class_name CatspyRoomBuilder
extends RefCounted


static func build(world: Node2D, room_data: Dictionary) -> Dictionary:
	var tw := CatspyConfig.tile_world_size(room_data)
	var w: int = int(room_data.get("width", 0))
	var h: int = int(room_data.get("height", 0))
	var ly: Variant = room_data.get("layers", {})
	if typeof(ly) != TYPE_DICTIONARY:
		ly = {}
	var walls: Variant = (ly as Dictionary).get("walls", [])
	if typeof(walls) != TYPE_ARRAY:
		walls = []
	if typeof(walls) != TYPE_ARRAY or walls.size() != h:
		var rid := str(room_data.get("room_id", room_data.get("id", "?")))
		var wr: int = (walls as Array).size() if typeof(walls) == TYPE_ARRAY else -1
		push_error("Invalid walls grid: room=%s walls_rows=%d height=%d" % [rid, wr, h])
		return {}
	var wall_grid: Array = walls

	for row in range(h):
		var row_a: Variant = wall_grid[row]
		if typeof(row_a) != TYPE_ARRAY:
			continue
		for col in range(mini(row_a.size(), w)):
			if int(row_a[col]) != 1:
				continue
			world.add_child(_make_wall_tile(col, row, tw))

	for t in room_data.get("extra_solid_tiles", []):
		if typeof(t) != TYPE_DICTIONARY:
			continue
		var cx := int(t.get("x", -1))
		var ry := int(t.get("y", -1))
		if ry < 0 or cx < 0 or ry >= h or cx >= w:
			continue
		var b := _make_wall_tile(cx, ry, tw)
		b.set_meta("gate_solid", true)
		world.add_child(b)

	var bg_key := str(room_data.get("background", "bg_cell"))
	var bg_path := _resolve_background_path(bg_key)
	var tex: Texture2D = null
	if ResourceLoader.exists(bg_path):
		tex = load(bg_path) as Texture2D
	if tex != null:
		var spr := Sprite2D.new()
		spr.texture = tex
		spr.centered = false
		spr.z_index = -100
		var src_w := tex.get_width()
		var src_h := tex.get_height()
		var trim: float = float(room_data.get("background_trim_bottom_ratio", 0.0))
		if trim > 0.0 and trim < 0.95:
			var cut := int(src_h * trim)
			src_h = maxi(1, src_h - cut)
			spr.region_enabled = true
			spr.region_rect = Rect2(0, 0, tex.get_width(), src_h)
		spr.scale = Vector2(float(w * tw) / float(src_w), float(h * tw) / float(src_h))
		world.add_child(spr)
	else:
		if ResourceLoader.exists(bg_path):
			push_warning("CatspyRoomBuilder: background exists but load() failed: %s" % bg_path)
		## ColorRect is Control — under Node2D (World) it often does not draw; use Polygon2D in world space.
		var poly := Polygon2D.new()
		poly.z_index = -50
		poly.color = Color(0.12, 0.14, 0.22)
		var rw := float(w * tw)
		var rh := float(h * tw)
		poly.polygon = PackedVector2Array([Vector2.ZERO, Vector2(rw, 0), Vector2(rw, rh), Vector2(0, rh)])
		world.add_child(poly)

	var exit_area := Area2D.new()
	exit_area.name = "ExitForward"
	var ex: Variant = room_data.get("exit", {})
	var ew := int(ex.get("w", 1))
	var eh := int(ex.get("h", 2))
	var ex_x := int(ex.get("x", 0)) * tw
	var ex_y := int(ex.get("y", 0)) * tw
	var cshape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(ew * tw, eh * tw)
	cshape.shape = rect
	cshape.position = Vector2(ex_x + ew * tw * 0.5, ex_y + eh * tw * 0.5)
	exit_area.add_child(cshape)
	exit_area.set_meta("rect", Rect2(ex_x, ex_y, ew * tw, eh * tw))
	world.add_child(exit_area)

	var return_rect: Rect2 = Rect2()
	var return_area: Area2D = null
	var re: Variant = room_data.get("return_exit", null)
	if typeof(re) == TYPE_DICTIONARY and re.get("target_room_id", "") != "":
		return_area = Area2D.new()
		return_area.name = "ExitReturn"
		var rw := int(re.get("w", 2))
		var rh := int(re.get("h", 3))
		var rx := int(re.get("x", 0)) * tw
		var ry := int(re.get("y", 0)) * tw
		var crs := CollisionShape2D.new()
		var rs := RectangleShape2D.new()
		rs.size = Vector2(rw * tw, rh * tw)
		crs.shape = rs
		crs.position = Vector2(rx + rw * tw * 0.5, ry + rh * tw * 0.5)
		return_area.add_child(crs)
		return_rect = Rect2(rx, ry, rw * tw, rh * tw)
		world.add_child(return_area)

	var spawn_tile := _resolve_spawn_tile(room_data, Game.from_room_id)
	var spawn_feet := _resolve_spawn_feet_world(wall_grid, spawn_tile, w, h, tw)

	var hz: Variant = room_data.get("entities", {}).get("hideZones", [])
	return {
		"wall_grid": wall_grid,
		"tile_world_size": tw,
		"world_width": w * tw,
		"world_height": h * tw,
		"spawn_tile": spawn_tile,
		"spawn_feet": spawn_feet,
		"background_res": bg_path,
		"background_exists": ResourceLoader.exists(bg_path),
		"exit_forward": exit_area,
		"exit_return": return_area,
		"return_rect": return_rect,
		"hide_zones": hz if typeof(hz) == TYPE_ARRAY else [],
	}


## Top of first **standable** solid at/under the spawn column: solid tile with air (or top edge) above.
## Ignores ceiling mass (solid with solid above) so we never snap feet to row 0.
static func feet_y_on_first_solid_below(wall_grid: Array, col: int, start_row: int, room_h: int, tw: int) -> float:
	var sr := clampi(start_row, 0, maxi(0, room_h - 1))
	for ry in range(sr, room_h):
		var row_a: Variant = wall_grid[ry]
		if typeof(row_a) != TYPE_ARRAY:
			continue
		var c := clampi(col, 0, row_a.size() - 1)
		if int(row_a[c]) != 1:
			continue
		if ry == 0:
			continue
		var row_up: Variant = wall_grid[ry - 1]
		if typeof(row_up) != TYPE_ARRAY or c >= row_up.size():
			continue
		if int(row_up[c]) == 1:
			continue
		return float(ry * tw)
	return float(sr * tw + tw * 0.5)


static func _resolve_spawn_feet_world(
	wall_grid: Array, spawn_tile: Vector2i, room_w: int, room_h: int, tw: int
) -> Vector2:
	var feet_x := float(spawn_tile.x * tw + tw * 0.5)
	var col := clampi(spawn_tile.x, 0, maxi(0, room_w - 1))
	var sr := clampi(spawn_tile.y, 0, maxi(0, room_h - 1))
	var feet_y := feet_y_on_first_solid_below(wall_grid, col, sr, room_h, tw)
	return Vector2(feet_x, feet_y)


static func _resolve_spawn_tile(room_data: Dictionary, from_id: String) -> Vector2i:
	var es: Variant = room_data.get("entry_spawns", {})
	if from_id != "" and typeof(es) == TYPE_DICTIONARY and es.has(from_id):
		var s: Variant = es[from_id]
		return Vector2i(int(s.get("x", 0)), int(s.get("y", 0)))
	var ps: Variant = room_data.get("playerSpawn", {})
	return Vector2i(int(ps.get("x", 0)), int(ps.get("y", 0)))


static func _resolve_background_path(bg_key: String) -> String:
	var stem: String = "res://assets/backgrounds/%s" % bg_key
	for ext in [".png", ".jpg", ".jpeg", ".webp"]:
		var p: String = stem + str(ext)
		if ResourceLoader.exists(p):
			return p
	return stem + ".png"


static func _make_wall_tile(col: int, row: int, tw: int) -> StaticBody2D:
	var body := StaticBody2D.new()
	body.position = Vector2(col * tw + tw * 0.5, row * tw + tw * 0.5)
	var cs := CollisionShape2D.new()
	var sh := RectangleShape2D.new()
	sh.size = Vector2(tw, tw)
	cs.shape = sh
	body.add_child(cs)
	return body
