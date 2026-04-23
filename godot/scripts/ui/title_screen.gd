extends Control


func _ready() -> void:
	Game.ui_paused = false


func _unhandled_input(event: InputEvent) -> void:
	## start_game() changes scene immediately; consume input first or get_viewport() may be null.
	if event.is_action_pressed("jump"):
		var vp := get_viewport()
		if vp != null:
			vp.set_input_as_handled()
		Game.start_game()
		return
	if event is InputEventKey and event.pressed and event.keycode == KEY_ENTER:
		var vp2 := get_viewport()
		if vp2 != null:
			vp2.set_input_as_handled()
		Game.start_game()
