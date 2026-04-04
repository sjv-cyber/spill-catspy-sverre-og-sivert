class_name CatspyDetection
extends RefCounted


static func player_in_hide_zone_px(px: float, py: float, hide_zones: Array, tile_world_size: int, is_cat: bool) -> bool:
	if not is_cat or hide_zones.is_empty():
		return false
	for z in hide_zones:
		if typeof(z) != TYPE_DICTIONARY:
			continue
		var zx := float(z.get("x", 0)) * tile_world_size
		var zy := float(z.get("y", 0)) * tile_world_size
		var zw := float(z.get("w", z.get("width", 1))) * tile_world_size
		var zh := float(z.get("h", z.get("height", 1))) * tile_world_size
		if px >= zx and px <= zx + zw and py >= zy and py <= zy + zh:
			return true
	return false


static func watcher_sees_player(
	watcher: Dictionary,
	player_cx: float, player_cy: float,
	wall_grid: Array, tile_world_size: int,
	range_mul: float = 1.0
) -> bool:
	var cone_range: float = float(watcher.get("cone_range", CatspyConfig.GUARD["detection_range"])) * range_mul
	var cone_angle: float = float(watcher.get("cone_angle", CatspyConfig.GUARD["cone_angle"]))
	var gx: float = float(watcher.get("vision_x", 0.0))
	var gy: float = float(watcher.get("vision_y", 0.0))
	var fa: float = float(watcher.get("facing_angle", 0.0))
	if not MathCatspy.is_point_in_cone(player_cx, player_cy, gx, gy, fa, cone_angle, cone_range):
		return false
	var blocker := MathCatspy.make_world_wall_blocker(wall_grid, tile_world_size)
	return MathCatspy.raycast_world(gx, gy, player_cx, player_cy, blocker)


static func check_detection(
	guards: Array,
	cameras: Array,
	player: Node2D,
	wall_grid: Array,
	tile_world_size: int,
	hide_zones: Array,
	is_human: bool
) -> bool:
	var b: Rect2 = player.get_hit_rect() if player.has_method("get_hit_rect") else Rect2(player.global_position, Vector2(32, 48))
	var px := b.get_center().x
	var py := b.get_center().y
	var mul: float = (float(CatspyConfig.HUMAN["detection_range_multiplier"]) if is_human
		else float(CatspyConfig.CAT["detection_range_multiplier"]))
	if player_in_hide_zone_px(px, py, hide_zones, tile_world_size, not is_human):
		return false
	var all: Array = []
	all.append_array(guards)
	all.append_array(cameras)
	for w in all:
		if w == null or not is_instance_valid(w):
			continue
		if w.has_method("is_suppressed"):
			if w.is_suppressed(Time.get_ticks_msec()):
				continue
		if not w.has_method("get_watcher_state"):
			continue
		var st: Dictionary = w.get_watcher_state()
		if watcher_sees_player(st, px, py, wall_grid, tile_world_size, mul):
			return true
	return false
