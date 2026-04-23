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
var _debug_layer: CanvasLayer
var _debug_label: Label
var _runtime_debug_visible: bool = false
var _transition_cooldown_until_msec: int = 0
## Ignores return_exit overlaps right after a room loads (held move input + tight spawns).
var _return_exit_grace_until_msec: int = 0

@onready var _world: Node2D = $World


func _ready() -> void:
	CatspyDebug.log_line("RoomRoot._ready BEGIN")
	Game.ui_paused = false
	var manifest := Game.load_manifest()
	CatspyDebug.log_line("RoomRoot manifest keys=%d default=%s" % [manifest.size(), str(manifest.get("default_room_id", "?"))])
	var rid := Game.current_room_id
	if rid == "":
		rid = str(manifest.get("default_room_id", "room_cell_01"))
		Game.current_room_id = rid
	CatspyDebug.log_line("RoomRoot loading room_id=%s" % rid)
	_room_data = RoomLoader.load_room_by_id(rid, manifest)
	if _room_data.is_empty():
		CatspyDebug.log_error("RoomRoot load_room_by_id returned empty for %s" % rid)
		push_error("Failed to load room: %s" % rid)
		_show_fatal_room_overlay(
			"Room data failed to load",
			"room_id: %s\n\nThe JSON file is missing, unreadable, or not an object. "
			+ "Open this project from godot/project.godot and check res://data/rooms/ "
			+ "is included (see Output panel for the exact path)." % rid
		)
		return
	CatspyDebug.log_line("RoomRoot json ok room_id=%s height=%s" % [rid, str(_room_data.get("height", "?"))])
	_tw = CatspyConfig.tile_world_size(_room_data)
	_return_exit_grace_until_msec = 0
	_exit_locked = false
	if str(_room_data.get("lock_behavior", "none")) == "boss":
		_exit_locked = true
	_room_state = str(_room_data.get("default_state", "idle"))
	if _room_state == "locked_boss":
		_room_state = "locked"
	var ly_pre: Variant = _room_data.get("layers", {})
	if typeof(ly_pre) != TYPE_DICTIONARY:
		ly_pre = {}
	var walls_precheck: Variant = (ly_pre as Dictionary).get("walls", [])
	var wrows: int = (walls_precheck as Array).size() if typeof(walls_precheck) == TYPE_ARRAY else -1
	var rh_pre := int(_room_data.get("height", 0))
	CatspyDebug.log_line("RoomRoot build start wrows=%d rh=%d" % [wrows, rh_pre])
	_ctx = CatspyRoomBuilder.build(_world, _room_data)
	if _ctx.is_empty():
		CatspyDebug.log_error("RoomRoot CatspyRoomBuilder.build returned empty ctx")
		push_error(
			"Room build failed — no geometry/spawn context. room_id=%s walls_rows=%d height=%s"
			% [rid, wrows, rh_pre]
		)
		_show_fatal_room_overlay(
			"Room build failed",
			"room_id: %s\nwalls rows: %d  json height: %d\n\n"
			+ "Wall row count must equal height. Fix the room JSON or check the Output panel."
			% [rid, wrows, rh_pre]
		)
		return
	_wall_grid = _ctx.get("wall_grid", [])
	var room_h: int = int(_room_data.get("height", 0))
	CatspyDebug.log_line(
		"RoomRoot build ok spawn_feet=%s world=%sx%s | %s"
		% [
			str(_ctx.get("spawn_feet", "?")),
			str(_ctx.get("world_width", "?")),
			str(_ctx.get("world_height", "?")),
			CatspyDebug.describe_camera(),
		]
	)
	## Scene file includes FallbackWorldCamera so a camera exists before this script runs (avoids grey void if build errors).
	_configure_fallback_world_camera()
	CatspyDebug.log_line("RoomRoot fallback camera configured | %s" % CatspyDebug.describe_camera())
	_spawn_entities(room_h)
	CatspyDebug.log_line("RoomRoot entities spawned World.children=%d | %s" % [_world.get_child_count(), CatspyDebug.describe_camera()])
	call_deferred("_deferred_finish_room_setup")


func _deferred_finish_room_setup() -> void:
	CatspyDebug.log_line("RoomRoot._deferred_finish_room_setup START | %s" % CatspyDebug.describe_camera())
	_spawn_player()
	if _player == null or not is_instance_valid(_player):
		CatspyDebug.log_error("RoomRoot player missing after _spawn_player")
		_show_fatal_room_overlay(
			"Player failed to set up",
			"See Godot Output for the first error. Often a missing texture, bad shader, or scene parse issue."
		)
		return
	_wire_exits()
	if _ctx.get("exit_return", null) != null:
		_return_exit_grace_until_msec = Time.get_ticks_msec() + 600
	if _configure_player_camera():
		CatspyDebug.log_line("RoomRoot player camera active | %s" % CatspyDebug.describe_camera())
		var fb := get_node_or_null("FallbackWorldCamera") as Camera2D
		if fb:
			fb.queue_free()
	else:
		CatspyDebug.log_error("RoomRoot player Camera2D not configured; keeping FallbackWorldCamera")
	var et := str(_room_data.get("entry_text", ""))
	if et != "":
		print("[Room] ", et)
	_add_form_hint_overlay()
	_spawn_interactables()
	_queue_monologue_if_any()
	_ensure_runtime_debug_overlay()
	if OS.is_debug_build():
		print("[CatspyRoom] ", _runtime_debug_summary_line())
	CatspyDebug.log_line("RoomRoot._deferred_finish_room_setup DONE | %s" % CatspyDebug.describe_camera())


func _spawn_player() -> void:
	_player = PLAYER_SCENE.instantiate()
	var sf: Vector2 = _ctx.get("spawn_feet", Vector2.ZERO)
	_player.position = sf
	_player.velocity = Vector2.ZERO
	add_child(_player)


func _add_form_hint_overlay() -> void:
	## Couch-play legibility: remind what each form is for (family playtest feedback).
	var layer := CanvasLayer.new()
	layer.layer = 5
	var root := _canvas_viewport_root(layer)
	var bar := PanelContainer.new()
	bar.anchor_left = 0.0
	bar.anchor_top = 1.0
	bar.anchor_right = 1.0
	bar.anchor_bottom = 1.0
	bar.offset_left = 16.0
	bar.offset_top = -44.0
	bar.offset_right = -16.0
	bar.offset_bottom = -6.0
	var inner := MarginContainer.new()
	inner.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	inner.add_theme_constant_override("margin_left", 8)
	inner.add_theme_constant_override("margin_right", 8)
	inner.add_theme_constant_override("margin_top", 4)
	inner.add_theme_constant_override("margin_bottom", 4)
	bar.add_child(inner)
	var lbl := Label.new()
	lbl.text = "Human: doors, exits, E = terminals  •  Cat: smaller + hide in ducts / shadow tiles  •  T: transform"
	lbl.add_theme_font_size_override("font_size", 11)
	lbl.modulate = Color(0.82, 0.88, 0.94, 0.92)
	lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	inner.add_child(lbl)
	root.add_child(bar)
	add_child(layer)


func _configure_player_camera() -> bool:
	var cam := _player.get_node_or_null("Camera2D") as Camera2D
	if cam == null:
		push_error("Player scene is missing Camera2D child")
		return false
	_apply_camera_limits(cam)
	## Pivot below feet so the character sits in the upper/mid frame (short rooms vs tall viewport).
	cam.position = Vector2(0, 64)
	cam.enabled = true
	cam.make_current()
	return true


func _apply_camera_limits(cam: Camera2D) -> void:
	cam.limit_left = 0
	cam.limit_top = 0
	cam.limit_right = int(_ctx.get("world_width", 640))
	cam.limit_bottom = int(_ctx.get("world_height", 480))


func _configure_fallback_world_camera() -> void:
	var cam := get_node_or_null("FallbackWorldCamera") as Camera2D
	if cam == null:
		CatspyDebug.log_error("RoomRoot.tscn missing FallbackWorldCamera — add Camera2D child")
		return
	var sf: Vector2 = _ctx.get("spawn_feet", cam.position)
	cam.position = sf
	_apply_camera_limits(cam)
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
	var now := Time.get_ticks_msec()
	if now < _transition_cooldown_until_msec:
		return
	if _exit_locked:
		return
	if str(_room_data.get("exit_action", "")) == "victory":
		_transition_cooldown_until_msec = now + 450
		Game.victory()
		return
	var nxt := str(_room_data.get("next_room_id", ""))
	if nxt == "":
		return
	_transition_cooldown_until_msec = now + 450
	Game.go_to_room(nxt)


func _on_exit_return(body: Node2D) -> void:
	if body != _player:
		return
	var now := Time.get_ticks_msec()
	if now < _return_exit_grace_until_msec:
		return
	if now < _transition_cooldown_until_msec:
		return
	var re: Variant = _room_data.get("return_exit", null)
	if typeof(re) != TYPE_DICTIONARY:
		return
	var tid := str(re.get("target_room_id", ""))
	if tid == "":
		return
	_transition_cooldown_until_msec = now + 450
	Game.go_to_room(tid)


func _process(_delta: float) -> void:
	if _runtime_debug_visible and _debug_label:
		_debug_label.text = _runtime_debug_panel_text()


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
	var proot := _canvas_viewport_root(_pause_layer)
	var panel := ColorRect.new()
	panel.color = Color(0, 0, 0, 0.55)
	panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	proot.add_child(panel)
	var lbl := Label.new()
	lbl.text = "PAUSED — ESC resume"
	lbl.set_anchors_preset(Control.PRESET_CENTER)
	lbl.add_theme_font_size_override("font_size", 14)
	proot.add_child(lbl)
	add_child(_pause_layer)


func _unhandled_input(event: InputEvent) -> void:
	if _terminal_layer:
		if event is InputEventKey and event.pressed and (
			event.keycode == KEY_ESCAPE or event.keycode == KEY_E
		):
			_close_terminal_overlay()
			get_viewport().set_input_as_handled()
		return

	if event is InputEventKey and event.pressed and event.keycode == KEY_F3:
		if _debug_layer:
			_runtime_debug_visible = not _runtime_debug_visible
			_debug_layer.visible = _runtime_debug_visible
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
	var ui_root := _canvas_viewport_root(_terminal_layer)
	var panel := ColorRect.new()
	panel.color = Color(0.02, 0.04, 0.08, 0.92)
	panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	ui_root.add_child(panel)
	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_top", 20)
	margin.add_theme_constant_override("margin_bottom", 20)
	ui_root.add_child(margin)
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
	var root := _canvas_viewport_root(layer)
	var bar := PanelContainer.new()
	bar.anchor_left = 0.0
	bar.anchor_top = 0.0
	bar.anchor_right = 1.0
	bar.anchor_bottom = 0.0
	bar.offset_left = 20.0
	bar.offset_top = 8.0
	bar.offset_right = -20.0
	bar.offset_bottom = 88.0
	var inner := MarginContainer.new()
	inner.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	inner.add_theme_constant_override("margin_left", 12)
	inner.add_theme_constant_override("margin_right", 12)
	inner.add_theme_constant_override("margin_top", 10)
	inner.add_theme_constant_override("margin_bottom", 10)
	bar.add_child(inner)
	var lbl := Label.new()
	lbl.text = line
	lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl.vertical_alignment = VERTICAL_ALIGNMENT_TOP
	lbl.add_theme_font_size_override("font_size", 12)
	lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	lbl.size_flags_vertical = Control.SIZE_EXPAND_FILL
	inner.add_child(lbl)
	root.add_child(bar)
	add_child(layer)
	get_tree().create_timer(4.2).timeout.connect(layer.queue_free)


func _canvas_viewport_root(layer: CanvasLayer) -> Control:
	## CanvasLayer has no size; children need a full-viewport Control for anchors / autowrap.
	var c := Control.new()
	c.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	c.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(c)
	return c


func _show_fatal_room_overlay(title: String, body: String) -> void:
	## Full-screen UI: works even when no Camera2D exists (load/build abort before player spawn).
	var layer := CanvasLayer.new()
	layer.layer = 200
	var root := _canvas_viewport_root(layer)
	var dim := ColorRect.new()
	dim.color = Color(0.04, 0.05, 0.08, 0.94)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root.add_child(dim)
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	margin.add_theme_constant_override("margin_left", 28)
	margin.add_theme_constant_override("margin_right", 28)
	margin.add_theme_constant_override("margin_top", 40)
	margin.add_theme_constant_override("margin_bottom", 40)
	root.add_child(margin)
	var v := VBoxContainer.new()
	v.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	v.add_theme_constant_override("separation", 16)
	margin.add_child(v)
	var title_lbl := Label.new()
	title_lbl.text = title
	title_lbl.add_theme_font_size_override("font_size", 22)
	title_lbl.add_theme_color_override("font_color", Color(1.0, 0.55, 0.45))
	title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	v.add_child(title_lbl)
	var body_lbl := Label.new()
	body_lbl.text = body
	body_lbl.add_theme_font_size_override("font_size", 15)
	body_lbl.add_theme_color_override("font_color", Color(0.92, 0.94, 0.98))
	body_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	body_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	body_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body_lbl.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(body_lbl)
	add_child(layer)


func _ensure_runtime_debug_overlay() -> void:
	if _debug_layer:
		return
	_debug_layer = CanvasLayer.new()
	_debug_layer.layer = 90
	_debug_layer.visible = false
	var root := _canvas_viewport_root(_debug_layer)
	var panel := PanelContainer.new()
	panel.offset_left = 8.0
	panel.offset_top = 8.0
	panel.offset_right = 440.0
	panel.offset_bottom = 300.0
	root.add_child(panel)
	_debug_label = Label.new()
	_debug_label.add_theme_font_size_override("font_size", 11)
	panel.add_child(_debug_label)
	add_child(_debug_layer)


func _runtime_debug_summary_line() -> String:
	var st: Vector2i = _ctx.get("spawn_tile", Vector2i.ZERO)
	var sf: Vector2 = _ctx.get("spawn_feet", Vector2.ZERO)
	return "id=%s from=%s spawn_tile=%s feet=%s bg_ok=%s wall_grid=%d" % [
		str(_room_data.get("room_id", "")),
		Game.from_room_id,
		str(st),
		str(sf),
		str(_ctx.get("background_exists", false)),
		_wall_grid.size(),
	]


func _runtime_debug_panel_text() -> String:
	var rid := str(_room_data.get("room_id", _room_data.get("id", "")))
	var ly_dbg: Variant = _room_data.get("layers", {})
	if typeof(ly_dbg) != TYPE_DICTIONARY:
		ly_dbg = {}
	var walls_v: Variant = (ly_dbg as Dictionary).get("walls", [])
	var wrows: int = (walls_v as Array).size() if typeof(walls_v) == TYPE_ARRAY else -1
	var rh := int(_room_data.get("height", 0))
	var st: Vector2i = _ctx.get("spawn_tile", Vector2i.ZERO)
	var sf: Vector2 = _ctx.get("spawn_feet", Vector2.ZERO)
	var bgp := str(_ctx.get("background_res", ""))
	var bg_ok: bool = bool(_ctx.get("background_exists", false))
	var ply := _player.global_position if _player else Vector2.ZERO
	var g0 := "—"
	if _guards.size() > 0:
		var gn: Variant = _guards[0]
		if gn is Node2D:
			g0 = "%.1f" % (gn as Node2D).global_position.y
	var wc := _world.get_child_count()
	return (
		"Runtime debug — F3 to hide\n"
		+ "room json id: %s\nGame.current_room_id: %s\nGame.from_room_id: %s\n"
		+ "walls_rows: %d  height: %d  rows_ok: %s\n"
		+ "spawn_tile: (%d,%d)\nspawn_feet: (%.1f, %.1f)\n"
		+ "background: %s\nResourceLoader.exists: %s\n"
		+ "wall_grid rows: %d\nplayer global: (%.1f, %.1f)\nfirst_guard.y: %s\nWorld children: %d"
	) % [
		rid,
		Game.current_room_id,
		Game.from_room_id,
		wrows,
		rh,
		"yes" if wrows == rh else "NO",
		st.x,
		st.y,
		sf.x,
		sf.y,
		bgp,
		"yes" if bg_ok else "NO",
		_wall_grid.size(),
		ply.x,
		ply.y,
		g0,
		wc,
	]
