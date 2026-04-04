extends Node2D
## ARGUS-style camera — sweep facing for vision checks.

var base_angle: float = 0.0
var sweep: float = 0.65
var sweep_speed: float = 1.1
var range_dist: float = 240.0
var cone_angle: float = 0.75
var phase: float = 0.0
var facing_angle: float = 0.0
var suppress_until_msec: float = 0.0

@onready var _sprite: Sprite2D = $Sprite2D


func setup_from_spec(spec: Dictionary, tile_world_size: int) -> void:
	base_angle = float(spec.get("baseAngle", 0.0))
	sweep = float(spec.get("sweep", 0.65))
	sweep_speed = float(spec.get("sweepSpeed", 1.1))
	range_dist = float(spec.get("range", 240.0))
	cone_angle = float(spec.get("coneAngle", 0.75))
	phase = float(spec.get("phaseOffset", 0.0))
	position = Vector2(
		float(spec.get("x", 0)) * tile_world_size + tile_world_size * 0.5,
		float(spec.get("y", 0)) * tile_world_size + tile_world_size * 0.5
	)
	if _sprite.texture:
		_sprite.scale = Vector2(44.0 / _sprite.texture.get_width(), 44.0 / _sprite.texture.get_height())


func _process(_delta: float) -> void:
	var t := Time.get_ticks_msec()
	facing_angle = base_angle + sin((t + phase) * 0.001 * sweep_speed) * sweep
	_sprite.rotation = facing_angle + PI * 0.5


func get_watcher_state() -> Dictionary:
	return {
		"vision_x": position.x,
		"vision_y": position.y,
		"facing_angle": facing_angle,
		"cone_range": range_dist,
		"cone_angle": cone_angle,
	}


func is_suppressed(now_msec: float) -> bool:
	return now_msec < suppress_until_msec


func suppress_for_ms(ms: float) -> void:
	var now := Time.get_ticks_msec()
	suppress_until_msec = maxf(suppress_until_msec, now + ms)
