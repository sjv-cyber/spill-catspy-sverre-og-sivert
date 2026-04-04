extends Node2D
## Loads room JSON, builds geometry, runs detection + transitions.

const PLAYER_SCENE := preload("res://scenes/player/Player.tscn")
const GUARD_SCENE := preload("res://scenes/entities/Guard.tscn")
const CAMERA_SCENE := preload("res://scenes/entities/ArgusCamera.tscn")

var _room_data: Dictionary = {}
var _ctx: Dictionary = {}
var _guards: Array = []
var _cams: Array = []
var _lasers: Array = []
var _player: CharacterBody2D
var _wall_grid: Array = []
var _tw: int = 32
var _room_state: String = "idle"
var _los_clear_frames: int = 0
var _exit_locked: bool = false
var _pause_layer: CanvasLayer

@onready var _world: Node2D = $World
@onready var _camera: Camera2D = $Camera2D


func _ready() -> void:
	Game.ui_paused = false
	var manifest := Game.load_manifest()
	var rid := Game.current_room_id
	if rid == "":
		rid = str(manifest.get("default_room_id", "room_cell_01"))
		Game.current_room_id = rid
	_room_data = RoomLoader.load_room_by_id(rid, manifest)
	if _room_data.is_empty():
		push_error("Failed to load room: %s" % rid)
		return
	_tw = CatspyConfig.tile_world_size(_room_data)
	_exit_locked = false
	if str(_room_data.get("lock_behavior", "none")) == "boss":
		_exit_locked = false
	_room_state = str(_room_data.get("default_state", "idle"))
	if _room_state == "locked_boss":
		_room_state = "locked"
	_ctx = CatspyRoomBuilder.build(_world, _room_data)
	_wall_grid = _ctx.get("wall_grid", [])
	_spawn_entities()
	_spawn_player()
	_wire_exits()
	_camera.enabled = true
	_camera.make_current()
	_camera.limit_left = 0
	_camera.limit_top = 0
	_camera.limit_right = int(_ctx.get("world_width", 640))
	_camera.limit_bottom = int(_ctx.get("world_height", 480))
	var et := str(_room_data.get("entry_text", ""))
	if et != "":
		print("[Room] ", et)


func _spawn_player() -> void:
	_player = PLAYER_SCENE.instantiate()
	add_child(_player)
	var sf: Vector2 = _ctx.get("spawn_feet", Vector2.ZERO)
	_player.global_position = sf


func _spawn_entities() -> void:
	var ent: Dictionary = _room_data.get("entities", {})
	for spec in ent.get("guards", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var g := GUARD_SCENE.instantiate()
		_world.add_child(g)
		g.setup_from_spec(spec, _tw)
		_guards.append(g)
	for spec in ent.get("mutants", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var g2 := GUARD_SCENE.instantiate()
		_world.add_child(g2)
		var ms: Dictionary = (spec as Dictionary).duplicate()
		if not ms.has("variant"):
			ms["variant"] = "mutant"
		g2.setup_from_spec(ms, _tw)
		_guards.append(g2)
	for spec in ent.get("cameras", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var c := CAMERA_SCENE.instantiate()
		_world.add_child(c)
		c.setup_from_spec(spec, _tw)
		_cams.append(c)
	for spec in ent.get("lasers", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var lz := CatspyLaser.new()
		_world.add_child(lz)
		lz.setup_from_spec(spec, _tw)
		_lasers.append(lz)


func _wire_exits() -> void:
	var fwd: Area2D = _ctx.get("exit_forward", null)
	if fwd:
		fwd.collision_mask = 2
		fwd.body_entered.connect(_on_exit_forward)
	var ret: Area2D = _ctx.get("exit_return", null)
	if ret:
		ret.collision_mask = 2
		ret.body_entered.connect(_on_exit_return)


func _on_exit_forward(body: Node2D) -> void:
	if body != _player:
		return
	if _exit_locked:
		return
	var nxt := str(_room_data.get("next_room_id", ""))
	if nxt == "":
		return
	Game.go_to_room(nxt)


func _on_exit_return(body: Node2D) -> void:
	if body != _player:
		return
	var re: Variant = _room_data.get("return_exit", null)
	if typeof(re) != TYPE_DICTIONARY:
		return
	var tid := str(re.get("target_room_id", ""))
	if tid == "":
		return
	Game.go_to_room(tid)


func _physics_process(_delta: float) -> void:
	if _player == null or _room_data.is_empty():
		return
	_camera.global_position = _player.global_position
	if Game.ui_paused:
		return

	var hide_z: Array = _ctx.get("hide_zones", [])
	if typeof(hide_z) != TYPE_ARRAY:
		hide_z = []
	var spotted := CatspyDetection.check_detection(
		_guards, _cams, _player, _wall_grid, _tw, hide_z, _player.is_human
	)
	var retreat: bool = _room_data.get("supports_retreat", false) == true
	var boss_room: bool = str(_room_data.get("lock_behavior", "none")) == "boss"

	if spotted:
		_los_clear_frames = 0
		if not retreat or boss_room:
			Game.game_over()
			return
		_room_state = "combat"
	elif retreat and _room_state == "combat":
		_los_clear_frames += 1
		if _los_clear_frames > 72:
			_room_state = "idle"

	var alertish := _room_state == "combat" or _room_state == "alert"
	for g in _guards:
		if g.has_method("set_alert_mode"):
			g.set_alert_mode(alertish and retreat)

	if retreat and alertish:
		var px := _player.global_position.x
		var py := _player.global_position.y
		for g in _guards:
			var d := g.global_position.distance_to(Vector2(px, py))
			if d < 52.0:
				Game.game_over()
				return

	var pr: Rect2 = _player.get_hit_rect()
	for lz in _lasers:
		if lz.has_method("hits_rect") and lz.hits_rect(pr):
			Game.game_over()
			return


func _toggle_pause() -> void:
	if _pause_layer:
		_pause_layer.queue_free()
		_pause_layer = null
		Game.ui_paused = false
		return
	Game.ui_paused = true
	_pause_layer = CanvasLayer.new()
	_pause_layer.layer = 100
	var panel := ColorRect.new()
	panel.color = Color(0, 0, 0, 0.55)
	panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	_pause_layer.add_child(panel)
	var lbl := Label.new()
	lbl.text = "PAUSED — ESC resume"
	lbl.set_anchors_preset(Control.PRESET_CENTER)
	lbl.position = Vector2(-80, -20)
	_pause_layer.add_child(lbl)
	add_child(_pause_layer)


func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("pause"):
		_toggle_pause()
		get_viewport().set_input_as_handled()
