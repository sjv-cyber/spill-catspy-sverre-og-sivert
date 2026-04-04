extends Control

var _lines: Array = []
var _idx: int = 0
var _timer: Timer
var _finished: bool = false

@onready var _lbl: Label = $Label


func _ready() -> void:
	_lines = StoryDB.get_ending_lines()
	_timer = Timer.new()
	_timer.one_shot = true
	add_child(_timer)
	_timer.timeout.connect(_on_line_timer)

	if _lines.is_empty():
		_finished = true
		_lbl.text = "SHUTTLE BAY — CLEAR\nData uplink away.\n\nSPACE / ENTER — Title"
		return

	_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_idx = 0
	_show_current_line()


func _show_current_line() -> void:
	if _idx >= _lines.size():
		_finished = true
		_lbl.text = "MISSION COMPLETE\n\nSPACE / ENTER — Title"
		return
	var block: Variant = _lines[_idx]
	if typeof(block) != TYPE_DICTIONARY:
		_idx += 1
		_show_current_line()
		return
	var d: Dictionary = block
	_lbl.text = str(d.get("text", ""))
	var ms: float = float(d.get("delay_ms", 3000.0))
	_timer.start(maxf(0.5, ms / 1000.0))


func _on_line_timer() -> void:
	_idx += 1
	_show_current_line()


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("jump") or (event is InputEventKey and event.pressed and event.keycode == KEY_ENTER):
		if _finished:
			Game.return_to_title()
		else:
			_timer.stop()
			_idx += 1
			_show_current_line()
		get_viewport().set_input_as_handled()
