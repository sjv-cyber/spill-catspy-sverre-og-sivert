extends CharacterBody2D
## Human/cat platformer; feet at global origin of body.

@export_group("Human movement", "human_")
@export var human_speed: float = 200.0
@export var human_decel: float = 1500.0
@export var human_jump_velocity: float = -400.0
@export var human_max_fall_speed: float = 600.0
@export var human_gravity: float = 980.0
@export var human_coyote_ms: float = 80.0
@export var human_jump_buffer_ms: float = 100.0

@export_group("Cat movement", "cat_")
@export var cat_speed: float = 320.0
@export var cat_decel: float = 1000.0
@export var cat_jump_velocity: float = -550.0
@export var cat_max_fall_speed: float = 600.0
@export var cat_gravity: float = 980.0
@export var cat_coyote_ms: float = 80.0
@export var cat_jump_buffer_ms: float = 100.0

var is_human: bool = true
var coyote_ms: float = 0.0
var jump_buffer_ms: float = 0.0
var last_transform_msec: float = -1e9

@onready var _sprite: Sprite2D = $Sprite2D
@onready var _hitbox: CollisionShape2D = $CollisionShape2D


func _ready() -> void:
	collision_layer = 2
	collision_mask = 1
	CatspyConfig.apply_magenta_chroma(_sprite)
	_apply_form(false)


func _movement_cfg() -> Dictionary:
	if is_human:
		return {
			"speed": human_speed,
			"decel": human_decel,
			"jump_velocity": human_jump_velocity,
			"max_fall_speed": human_max_fall_speed,
			"gravity": human_gravity,
			"coyote_ms": human_coyote_ms,
			"jump_buffer_ms": human_jump_buffer_ms,
		}
	return {
		"speed": cat_speed,
		"decel": cat_decel,
		"jump_velocity": cat_jump_velocity,
		"max_fall_speed": cat_max_fall_speed,
		"gravity": cat_gravity,
		"coyote_ms": cat_coyote_ms,
		"jump_buffer_ms": cat_jump_buffer_ms,
	}


func _physics_process(delta: float) -> void:
	if Game.ui_paused:
		return
	var cfg := _movement_cfg()
	var on_floor := is_on_floor()
	if on_floor:
		coyote_ms = float(cfg["coyote_ms"])
	else:
		coyote_ms = maxf(0.0, coyote_ms - delta * 1000.0)

	if Input.is_action_just_pressed("jump"):
		jump_buffer_ms = float(cfg["jump_buffer_ms"])
	else:
		jump_buffer_ms = maxf(0.0, jump_buffer_ms - delta * 1000.0)

	var dir := Input.get_axis("move_left", "move_right")
	if dir != 0:
		velocity.x = dir * float(cfg["speed"])
	else:
		var decel: float = float(cfg.get("decel", 1200.0))
		velocity.x = move_toward(velocity.x, 0.0, decel * delta)

	if not is_on_floor():
		velocity.y += float(cfg.get("gravity", 980.0)) * delta
	else:
		velocity.y = 0.0

	if jump_buffer_ms > 0.0 and coyote_ms > 0.0:
		velocity.y = float(cfg["jump_velocity"])
		jump_buffer_ms = 0.0
		coyote_ms = 0.0

	velocity.y = clampf(velocity.y, -2000.0, float(cfg["max_fall_speed"]))

	move_and_slide()

	if Input.is_action_just_pressed("transform"):
		_try_transform()

	if Input.is_action_just_pressed("debug_next_room"):
		_debug_next_room()

	if velocity.x > 12.0:
		_sprite.flip_h = false
	elif velocity.x < -12.0:
		_sprite.flip_h = true


func _try_transform() -> void:
	var now := Time.get_ticks_msec()
	if now - last_transform_msec < CatspyConfig.TRANSFORM_COOLDOWN_MS:
		return
	last_transform_msec = now
	is_human = not is_human
	_apply_form(true)


func _apply_form(anchor_feet: bool) -> void:
	var bottom_before := global_position.y
	var cfg := CatspyConfig.HUMAN if is_human else CatspyConfig.CAT
	var path := "res://assets/sprites/player_human.png" if is_human else "res://assets/sprites/player_cat.png"
	if ResourceLoader.exists(path):
		_sprite.texture = load(path)
	var tex: Texture2D = _sprite.texture
	if tex == null:
		return
	_sprite.region_enabled = true
	_sprite.region_rect = CatspyConfig.player_sheet_region(tex, not is_human)
	var fw := maxf(1.0, _sprite.region_rect.size.x)
	var fh := maxf(1.0, _sprite.region_rect.size.y)
	var bw := float(cfg["width"])
	var bh := float(cfg["height"])
	var s := minf(bw / float(fw), bh / float(fh))
	_sprite.scale = Vector2(s, s)
	var sh := RectangleShape2D.new()
	sh.size = Vector2(bw, bh)
	_hitbox.shape = sh
	_hitbox.position = Vector2(0, -bh * 0.5)
	if anchor_feet:
		var bottom_after := global_position.y
		global_position.y += bottom_before - bottom_after


func get_hit_rect() -> Rect2:
	var hs: RectangleShape2D = _hitbox.shape as RectangleShape2D
	if hs == null:
		return Rect2(global_position, Vector2(32, 48))
	var ext := hs.size * 0.5
	var c := _hitbox.global_position
	return Rect2(c - ext, hs.size)


func _debug_next_room() -> void:
	var m := Game.load_manifest()
	var ids := RoomLoader.list_room_ids(m)
	if ids.is_empty():
		return
	var i := ids.find(Game.current_room_id)
	var nxt := ids[(maxi(0, i) + 1) % ids.size()]
	Game.go_to_room(nxt)
