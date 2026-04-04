extends Control


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("jump") or (event is InputEventKey and event.pressed and event.keycode == KEY_ENTER):
		Game.return_to_title()
		get_viewport().set_input_as_handled()
