extends Node
## Global game state, scene switching, input map setup.

const ROOM_SCENE := "res://scenes/gameplay/room/RoomRoot.tscn"
const TITLE_SCENE := "res://scenes/ui/Title.tscn"
const GAME_OVER_SCENE := "res://scenes/ui/GameOver.tscn"

var current_room_id: String = ""
var from_room_id: String = ""
var default_room_id: String = "room_cell_01"
var paused: bool = false
## Soft pause (overlay); does not freeze whole tree — player respects this.
var ui_paused: bool = false

func _ready() -> void:
	_setup_input_map()


func _setup_input_map() -> void:
	_add_key_action("move_left", KEY_A)
	_add_key_action("move_left", KEY_LEFT)
	_add_key_action("move_right", KEY_D)
	_add_key_action("move_right", KEY_RIGHT)
	_add_key_action("jump", KEY_SPACE)
	_add_key_action("jump", KEY_W)
	_add_key_action("jump", KEY_UP)
	_add_key_action("transform", KEY_T)
	_add_key_action("interact", KEY_E)
	_add_key_action("pause", KEY_ESCAPE)
	_add_key_action("debug_next_room", KEY_F1)


func _add_key_action(action: String, keycode: Key) -> void:
	if not InputMap.has_action(action):
		InputMap.add_action(action)
	var ev := InputEventKey.new()
	ev.keycode = keycode
	InputMap.action_add_event(action, ev)


func start_game() -> void:
	current_room_id = ""
	from_room_id = ""
	go_to_room(default_room_id)


func go_to_room(room_id: String) -> void:
	from_room_id = current_room_id
	current_room_id = room_id
	var p := load(ROOM_SCENE) as PackedScene
	if p == null:
		push_error("Missing RoomRoot scene")
		return
	get_tree().change_scene_to_packed(p)


func game_over() -> void:
	var p := load(GAME_OVER_SCENE) as PackedScene
	if p:
		get_tree().change_scene_to_packed(p)


func return_to_title() -> void:
	var p := load(TITLE_SCENE) as PackedScene
	if p:
		get_tree().change_scene_to_packed(p)


func load_manifest() -> Dictionary:
	var path := "res://data/rooms/manifest.json"
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		push_error("Cannot open manifest: %s" % path)
		return {}
	var txt := f.get_as_text()
	var data = JSON.parse_string(txt)
	if typeof(data) != TYPE_DICTIONARY:
		return {}
	default_room_id = str(data.get("default_room_id", "room_cell_01"))
	return data
