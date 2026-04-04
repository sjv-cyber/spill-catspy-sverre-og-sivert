extends Node2D
## Loads room JSON, builds geometry, runs detection + transitions.

const PLAYER_SCENE := preload("res://scenes/gameplay/player/Player.tscn")
const GUARD_SCENE := preload("res://scenes/gameplay/entities/Guard.tscn")
const CAMERA_SCENE := preload("res://scenes/gameplay/entities/ArgusCamera.tscn")

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
var _terminal_layer: CanvasLayer

@onready var _world: Node2D = $World


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
		_exit_locked = true
	_room_state = str(_room_data.get("default_state", "idle"))
	if _room_state == "locked_boss":
		_room_state = "locked"
	_ctx = CatspyRoomBuilder.build(_world, _room_data)
	_wall_grid = _ctx.get("wall_grid", [])
	var room_h: int = int(_room_data.get("height", 0))
	_spawn_entities(room_h)
	_spawn_player()
	_wire_exits()
	_configure_player_camera()
	var et := str(_room_data.get("entry_text", ""))
	if et != "":
		print("[Room] ", et)
	_add_form_hint_overlay()
	_spawn_interactables()
	_queue_monologue_if_any()


func _spawn_player() -> void:
	_player = PLAYER_SCENE.instantiate()
	add_child(_player)
	var sf: Vector2 = _ctx.get("spawn_feet", Vector2.ZERO)
	_player.global_position = sf


func _add_form_hint_overlay() -> void:
	## Couch-play legibility: remind what each form is for (family playtest feedback).
	var layer := CanvasLayer.new()
	layer.layer = 5
	var lbl := Label.new()
	lbl.text = "Human: doors, exits, E = terminals  •  Cat: sneak / smaller  •  T: transform"
	lbl.add_theme_font_size_override("font_size", 11)
	lbl.modulate = Color(0.82, 0.88, 0.94, 0.72)
	lbl.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	lbl.anchor_left = 0.0
	lbl.anchor_top = 1.0
	lbl.anchor_right = 0.0
	lbl.anchor_bottom = 1.0
	lbl.offset_left = 10.0
	lbl.offset_top = -26.0
	lbl.offset_right = 900.0
	lbl.offset_bottom = -6.0
	layer.add_child(lbl)
	add_child(layer)


func _configure_player_camera() -> void:
	var cam := _player.get_node_or_null("Camera2D") as Camera2D
	if cam == null:
		push_error("Player scene is missing Camera2D child")
		return
	cam.limit_left = 0
	cam.limit_top = 0
	cam.limit_right = int(_ctx.get("world_width", 640))
	cam.limit_bottom = int(_ctx.get("world_height", 480))
	cam.enabled = true
	cam.make_current()


func _spawn_entities(room_h: int) -> void:
	var ent: Dictionary = _room_data.get("entities", {})
	for spec in ent.get("guards", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var g := GUARD_SCENE.instantiate()
		_world.add_child(g)
		g.setup_from_spec(spec, _tw, _wall_grid, room_h)
		_guards.append(g)
	for spec in ent.get("mutants", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var g2 := GUARD_SCENE.instantiate()
		_world.add_child(g2)
		var ms: Dictionary = (spec as Dictionary).duplicate()
		if not ms.has("variant"):
			ms["variant"] = "mutant"
		g2.setup_from_spec(ms, _tw, _wall_grid, room_h)
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
	if str(_room_data.get("exit_action", "")) == "victory":
		Game.victory()
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
			if not (g is Node2D):
				continue
			var g2: Node2D = g
			var d: float = g2.global_position.distance_to(Vector2(px, py))
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
	if _terminal_layer:
		if event is InputEventKey and event.pressed and (
			event.keycode == KEY_ESCAPE or event.keycode == KEY_E
		):
			_close_terminal_overlay()
			get_viewport().set_input_as_handled()
		return

	if event.is_action_pressed("interact"):
		if _player and _player.is_human and _try_interact_world():
			get_viewport().set_input_as_handled()
		return

	if event.is_action_pressed("pause"):
		_toggle_pause()
		get_viewport().set_input_as_handled()


func _spawn_interactables() -> void:
	for spec in _room_data.get("interactables", []):
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var iw := int(spec.get("w", 1))
		var ih := int(spec.get("h", 1))
		var ix := int(spec.get("x", 0))
		var iy := int(spec.get("y", 0))
		var area := Area2D.new()
		area.collision_layer = 0
		area.collision_mask = 2
		area.monitoring = true
		var cs := CollisionShape2D.new()
		var rect := RectangleShape2D.new()
		rect.size = Vector2(iw * _tw, ih * _tw)
		cs.shape = rect
		cs.position = Vector2(ix * _tw + iw * _tw * 0.5, iy * _tw + ih * _tw * 0.5)
		area.add_child(cs)
		area.set_meta("interact_spec", spec)
		_world.add_child(area)


func _try_interact_world() -> bool:
	if _player == null:
		return false
	for child in _world.get_children():
		if not (child is Area2D):
			continue
		var a: Area2D = child
		if not a.has_meta("interact_spec"):
			continue
		if not a.overlaps_body(_player):
			continue
		var spec: Variant = a.get_meta("interact_spec")
		if typeof(spec) != TYPE_DICTIONARY:
			continue
		var d: Dictionary = spec
		if d.get("requires_human", false) == true and not _player.is_human:
			continue
		if _execute_interact(d):
			return true
	return false


func _execute_interact(spec: Dictionary) -> bool:
	var act := str(spec.get("action", ""))
	match act:
		"terminal_log":
			var lid := str(spec.get("log_id", ""))
			var disp := StoryDB.get_terminal_display(lid)
			if disp.is_empty():
				push_warning("Unknown terminal log_id: %s" % lid)
				return false
			_open_terminal_overlay(str(disp.get("title", "LOG")), str(disp.get("body", "")))
			return true
		"clear_boss":
			_exit_locked = false
			print("[Room] Boss lock cleared — exit open.")
			return true
		"suppress_cameras":
			var dur := float(spec.get("duration_ms", 6000.0))
			for c in _cams:
				if c.has_method("suppress_for_ms"):
					c.suppress_for_ms(dur)
			print("[Room] ARGUS cameras suppressed %.0f ms" % dur)
			return true
		"hack_robot":
			if spec.get("open_gate", false) == true:
				_remove_gate_solids()
			print("[Room] Robot shell accessed.")
			return true
		_:
			push_warning("Unknown interact action: %s" % act)
			return false


func _remove_gate_solids() -> void:
	var to_free: Array = []
	for child in _world.get_children():
		if child is StaticBody2D and child.has_meta("gate_solid"):
			to_free.append(child)
	for b in to_free:
		(b as Node).queue_free()


func _open_terminal_overlay(title: String, body: String) -> void:
	_close_terminal_overlay()
	Game.ui_paused = true
	_terminal_layer = CanvasLayer.new()
	_terminal_layer.layer = 80
	var panel := ColorRect.new()
	panel.color = Color(0.02, 0.04, 0.08, 0.92)
	panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	_terminal_layer.add_child(panel)
	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_top", 20)
	margin.add_theme_constant_override("margin_bottom", 20)
	_terminal_layer.add_child(margin)
	var v := VBoxContainer.new()
	v.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_child(v)
	var title_lbl := Label.new()
	title_lbl.text = title
	title_lbl.add_theme_font_size_override("font_size", 16)
	v.add_child(title_lbl)
	var body_lbl := Label.new()
	body_lbl.text = body
	body_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	body_lbl.add_theme_font_size_override("font_size", 13)
	v.add_child(body_lbl)
	var hint := Label.new()
	hint.text = "E or ESC — close"
	hint.add_theme_font_size_override("font_size", 11)
	hint.modulate = Color(0.7, 0.75, 0.8)
	v.add_child(hint)
	add_child(_terminal_layer)


func _close_terminal_overlay() -> void:
	if _terminal_layer:
		_terminal_layer.queue_free()
		_terminal_layer = null
		Game.ui_paused = false


func _queue_monologue_if_any() -> void:
	var rid := str(_room_data.get("room_id", _room_data.get("id", "")))
	var line := StoryDB.get_monologue_for_room(rid)
	if line == "":
		return
	get_tree().create_timer(0.45).timeout.connect(_show_monologue_overlay.bind(line))


func _show_monologue_overlay(line: String) -> void:
	if line == "":
		return
	var layer := CanvasLayer.new()
	layer.layer = 55
	var panel := PanelContainer.new()
	panel.set_anchors_preset(Control.PRESET_CENTER_TOP)
	panel.offset_left = -380.0
	panel.offset_top = 12.0
	panel.offset_right = 380.0
	panel.offset_bottom = 56.0
	var inner := MarginContainer.new()
	inner.add_theme_constant_override("margin_left", 12)
	inner.add_theme_constant_override("margin_right", 12)
	inner.add_theme_constant_override("margin_top", 8)
	inner.add_theme_constant_override("margin_bottom", 8)
	panel.add_child(inner)
	var lbl := Label.new()
	lbl.text = line
	lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl.add_theme_font_size_override("font_size", 12)
	inner.add_child(lbl)
	layer.add_child(panel)
	add_child(layer)
	get_tree().create_timer(4.2).timeout.connect(layer.queue_free)
