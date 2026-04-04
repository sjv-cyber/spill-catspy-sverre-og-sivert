extends Node2D
## Patrol + vision for detection (Phaser Guard.js parity).

var waypoints: PackedVector2Array = PackedVector2Array()
var wp_index: int = 1
var cone_range: float = 200.0
var cone_angle: float = PI / 2.0
var move_speed: float = 80.0
var wait_until_msec: float = 0.0
var facing_angle: float = 0.0
var alert_mode: bool = false

@onready var _sprite: Sprite2D = $Sprite2D


func setup_from_spec(spec: Dictionary, tile_world_size: int) -> void:
	var patrol: Array = spec.get("patrol", [])
	if patrol.size() < 2:
		push_error("Guard needs >=2 patrol points")
		return
	waypoints = PackedVector2Array()
	for p in patrol:
		if typeof(p) != TYPE_DICTIONARY:
			continue
		var wx := float(p.get("x", 0)) * tile_world_size + tile_world_size * 0.5
		var wy := float(p.get("y", 0)) * tile_world_size + tile_world_size * 0.5
		waypoints.append(Vector2(wx, wy))
	wp_index = 1
	position = waypoints[0]
	cone_range = float(spec.get("coneRange", CatspyConfig.GUARD["detection_range"]))
	cone_angle = float(spec.get("coneAngle", CatspyConfig.GUARD["cone_angle"]))
	move_speed = float(spec.get("speed", CatspyConfig.GUARD["speed"]))
	_face_toward(waypoints[1])
	_scale_sprite(spec)


func _scale_sprite(spec: Dictionary) -> void:
	var tex: Texture2D = _sprite.texture
	if tex == null:
		return
	var fw := maxf(1.0, float(tex.get_width()))
	var fh := maxf(1.0, float(tex.get_height()))
	var target_w := 52.0
	var target_h := 78.0
	var variant := str(spec.get("variant", "standard"))
	if variant == "mutant":
		target_w *= 1.08
		target_h *= 1.08
	elif variant == "elite":
		target_w *= 1.04
		target_h *= 1.04
	var s := minf(target_w / fw, target_h / fh)
	_sprite.scale = Vector2(s, s)
	if variant == "mutant":
		_sprite.modulate = Color(0.77, 0.86, 0.75)
	elif variant == "elite":
		_sprite.modulate = Color(0.72, 0.75, 0.82)


func set_alert_mode(on: bool) -> void:
	alert_mode = on


func _face_toward(target: Vector2) -> void:
	facing_angle = atan2(target.y - position.y, target.x - position.x)
	_sprite.flip_h = (target.x > position.x)


func _physics_process(delta: float) -> void:
	var now := Time.get_ticks_msec()
	if now < wait_until_msec:
		return
	if waypoints.is_empty():
		return
	var target := waypoints[wp_index]
	var dx := target.x - position.x
	var dy := target.y - position.y
	var dist: float = Vector2(dx, dy).length()
	if dist < 6.0:
		wp_index = (wp_index + 1) % waypoints.size()
		wait_until_msec = now + float(CatspyConfig.GUARD["wait_duration"]) * 1000.0
		var nxt := waypoints[wp_index]
		_face_toward(nxt)
		return
	_face_toward(target)
	var spd := move_speed * (1.5 if alert_mode else 1.0)
	var step := spd * delta
	position += Vector2(dx / dist, dy / dist) * step
	_sprite.flip_h = dx > 0


func get_watcher_state() -> Dictionary:
	return {
		"vision_x": position.x,
		"vision_y": position.y - 18.0,
		"facing_angle": facing_angle,
		"cone_range": cone_range,
		"cone_angle": cone_angle,
	}
