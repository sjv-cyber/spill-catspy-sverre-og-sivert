extends Control


func _ready() -> void:
	Game.ui_paused = false


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("jump"):
		Game.start_game()
		get_viewport().set_input_as_handled()
	if event is InputEventKey and event.pressed and event.keycode == KEY_ENTER:
		Game.start_game()
		get_viewport().set_input_as_handled()
