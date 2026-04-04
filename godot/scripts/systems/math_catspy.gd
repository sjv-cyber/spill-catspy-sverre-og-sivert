class_name MathCatspy
extends RefCounted


static func is_point_in_cone(px: float, py: float, gx: float, gy: float, facing_angle: float, cone_angle: float, range_dist: float) -> bool:
	var dx := px - gx
	var dy := py - gy
	var dist := sqrt(dx * dx + dy * dy)
	if dist > range_dist:
		return false
	var angle_to_player := atan2(dy, dx)
	var diff := angle_to_player - facing_angle
	diff = atan2(sin(diff), cos(diff))
	return absf(diff) <= cone_angle * 0.5


static func raycast_world(x1: float, y1: float, x2: float, y2: float, is_blocked: Callable) -> bool:
	var dx := x2 - x1
	var dy := y2 - y1
	var steps: int = maxi(ceili(absf(dx)), ceili(absf(dy)))
	if steps == 0:
		return true
	var sx := dx / float(steps)
	var sy := dy / float(steps)
	var cx := x1
	var cy := y1
	for i in steps:
		cx += sx
		cy += sy
		if is_blocked.call(cx, cy):
			return false
	return true


static func make_world_wall_blocker(wall_grid: Array, tile_world_size: int) -> Callable:
	var rows := wall_grid.size()
	var cols: int = 0
	if rows > 0 and typeof(wall_grid[0]) == TYPE_ARRAY:
		cols = wall_grid[0].size()
	return func(wpx: float, wpy: float) -> bool:
		var c := int(floor(wpx / float(tile_world_size)))
		var r := int(floor(wpy / float(tile_world_size)))
		if r < 0 or c < 0 or r >= rows or c >= cols:
			return true
		var row: Variant = wall_grid[r]
		if typeof(row) != TYPE_ARRAY or c >= row.size():
			return true
		return int(row[c]) == 1
