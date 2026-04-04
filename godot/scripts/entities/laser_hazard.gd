class_name CatspyLaser
extends Node2D
## Axis-aligned laser segment; toggles active on a cycle (Phaser LaserHazard).

var cx1: float
var cy1: float
var cx2: float
var cy2: float
var thickness: float = 10.0
var on_ms: float = 2000.0
var off_ms: float = 1500.0
var phase_ms: float = 0.0
var active: bool = true
var hit_rect: Rect2 = Rect2()

var _line: Line2D


func setup_from_spec(spec: Dictionary, tw: int) -> void:
	cx1 = float(spec.get("x1", 0)) * tw + tw * 0.5
	cy1 = float(spec.get("y1", 0)) * tw + tw * 0.5
	cx2 = float(spec.get("x2", 0)) * tw + tw * 0.5
	cy2 = float(spec.get("y2", 0)) * tw + tw * 0.5
	thickness = float(spec.get("thickness_px", 10))
	on_ms = float(spec.get("on_ms", float(CatspyConfig.LASER["default_on_duration"]) * 1000.0))
	off_ms = float(spec.get("off_ms", float(CatspyConfig.LASER["default_off_duration"]) * 1000.0))
	phase_ms = float(spec.get("phase_ms", 0.0))
	var pad := thickness * 0.5
	hit_rect = Rect2(
		minf(cx1, cx2) - pad,
		minf(cy1, cy2) - pad,
		absf(cx2 - cx1) + thickness,
		absf(cy2 - cy1) + thickness
	)
	_line = Line2D.new()
	_line.width = thickness
	_line.default_color = Color(1.0, 0.2, 0.3, 0.9)
	_line.points = PackedVector2Array([Vector2(cx1, cy1), Vector2(cx2, cy2)])
	add_child(_line)


func _process(_delta: float) -> void:
	var time := Time.get_ticks_msec()
	var cycle := on_ms + off_ms
	if cycle <= 0.0:
		active = true
	else:
		var t := fposmod(time + phase_ms, cycle)
		active = t < on_ms
	var ca := 0.92 if active else 0.2
	_line.default_color = Color(1.0, 0.2, 0.3, ca)
	_line.width = thickness if active else thickness * 0.45


func hits_rect(r: Rect2) -> bool:
	if not active:
		return false
	return hit_rect.intersects(r)
