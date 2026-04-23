extends Node
## Always-on runtime trace: root CanvasLayer HUD + append-only log under user://.
## F2 toggles HUD. Log path is printed once at boot (open from OS user data / Godot "Open user data folder").

const MAX_HUD_LINES := 72
const LOG_REL := "user://catspy_runtime.log"

var _hud_layer: CanvasLayer
var _rt: RichTextLabel
var _hud_visible: bool = true
var _buf: PackedStringArray = PackedStringArray()


func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	## Always show HUD until F2 — grey-screen bugs need visible traces even in odd build configs.
	_hud_visible = true
	get_tree().scene_changed.connect(_on_scene_changed_signal)
	call_deferred("_mount_hud")
	log_line("=== boot debug_build=%s user_data_dir=%s" % [str(OS.is_debug_build()), OS.get_user_data_dir()])
	log_line("log_file=%s" % ProjectSettings.globalize_path(LOG_REL))


func _on_scene_changed_signal() -> void:
	log_line("signal scene_changed | %s | %s" % [describe_scene(), describe_camera()])


func _mount_hud() -> void:
	var r := get_tree().root
	if r.get_node_or_null("CatspyDebugHud") != null:
		return
	_hud_layer = CanvasLayer.new()
	_hud_layer.name = "CatspyDebugHud"
	_hud_layer.layer = 3200
	var shell := Control.new()
	shell.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	shell.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_hud_layer.add_child(shell)
	var bg := ColorRect.new()
	bg.color = Color(0.02, 0.04, 0.07, 0.88)
	bg.anchor_left = 0.0
	bg.anchor_top = 0.0
	bg.anchor_right = 1.0
	bg.anchor_bottom = 0.0
	bg.offset_bottom = 200.0
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	shell.add_child(bg)
	_rt = RichTextLabel.new()
	_rt.bbcode_enabled = false
	_rt.fit_content = false
	_rt.scroll_active = true
	_rt.scroll_following = true
	_rt.anchor_left = 0.0
	_rt.anchor_top = 0.0
	_rt.anchor_right = 1.0
	_rt.anchor_bottom = 0.0
	_rt.offset_left = 8.0
	_rt.offset_top = 4.0
	_rt.offset_right = -8.0
	_rt.offset_bottom = 196.0
	_rt.add_theme_font_size_override("normal_font_size", 11)
	_rt.mouse_filter = Control.MOUSE_FILTER_IGNORE
	shell.add_child(_rt)
	var hint := Label.new()
	hint.text = "CatspyDebug  F2=hide/show  log: user://catspy_runtime.log"
	hint.add_theme_font_size_override("font_size", 10)
	hint.add_theme_color_override("font_color", Color(0.65, 0.72, 0.8, 0.95))
	hint.anchor_left = 0.0
	hint.anchor_top = 1.0
	hint.anchor_right = 1.0
	hint.anchor_bottom = 1.0
	hint.offset_top = -22.0
	hint.offset_bottom = -4.0
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.mouse_filter = Control.MOUSE_FILTER_IGNORE
	shell.add_child(hint)
	r.add_child(_hud_layer)
	_apply_hud_visibility()
	_rerender_hud()


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_F2:
		_hud_visible = not _hud_visible
		_apply_hud_visibility()
		get_viewport().set_input_as_handled()


func _apply_hud_visibility() -> void:
	if _hud_layer:
		_hud_layer.visible = _hud_visible


func log_line(msg: String) -> void:
	var t := Time.get_ticks_msec()
	var line := "%d | %s" % [t, msg]
	print("[CatspyDebug] ", line)
	_append_file(line)
	if _buf.size() >= MAX_HUD_LINES:
		_buf.remove_at(0)
	_buf.append(line)
	_rerender_hud()


func log_error(msg: String) -> void:
	log_line("ERROR: %s" % msg)
	push_error("[CatspyDebug] %s" % msg)


func _append_file(line: String) -> void:
	if not FileAccess.file_exists(LOG_REL):
		var c := FileAccess.open(LOG_REL, FileAccess.WRITE)
		if c:
			c.close()
	var f := FileAccess.open(LOG_REL, FileAccess.READ_WRITE)
	if f == null:
		return
	f.seek_end()
	f.store_line(line)
	f.close()


func _rerender_hud() -> void:
	if _rt == null:
		return
	_rt.text = _buf_join(_buf, "\n")


func _buf_join(parts: PackedStringArray, sep: String) -> String:
	if parts.is_empty():
		return ""
	var out := parts[0]
	for i in range(1, parts.size()):
		out += sep + parts[i]
	return out


func describe_camera() -> String:
	## Prefer the game scene's viewport (autoload node's get_viewport() can disagree with some tree setups).
	var t := get_tree()
	var vp: Viewport = null
	if t and t.current_scene:
		vp = t.current_scene.get_viewport()
	if vp == null:
		vp = get_viewport()
	if vp == null:
		return "viewport=null"
	var cam := vp.get_camera_2d()
	if cam == null:
		return "camera2d=null"
	return "camera2d=%s enabled=%s current=%s pos=%s" % [
		cam.get_path(),
		str(cam.enabled),
		str(cam.is_current()),
		str(cam.global_position),
	]


func describe_scene() -> String:
	var t := get_tree()
	if t == null:
		return "tree=null"
	var cs := t.current_scene
	if cs == null:
		return "current_scene=null"
	return "scene=%s file=%s" % [cs.name, cs.scene_file_path]


func on_scene_changed_note(where: String) -> void:
	log_line("%s | %s | %s" % [where, describe_scene(), describe_camera()])
