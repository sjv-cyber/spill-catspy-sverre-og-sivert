class_name CatspyConfig
extends Object
## Mirrors src/config.js tunables for CatSpy Godot runtime.

const _CHROMA_SHADER := preload("res://assets/shaders/chroma_magenta.gdshader")

## Wide 1376×768 character sheets: crop rects match `src/scenes/BootScene.js` (CROP_PLAYER / CROP_CAT / CROP_GUARD).
static func player_sheet_region(tex: Texture2D, cat_form: bool) -> Rect2:
	var tw := float(tex.get_width())
	var th := float(tex.get_height())
	if cat_form:
		return Rect2(0.10 * tw, 0.17 * th, 0.88 * tw, 0.80 * th)
	return Rect2(0.34 * tw, 0.06 * th, 0.32 * tw, 0.88 * th)


static func guard_sheet_region(tex: Texture2D) -> Rect2:
	var tw := float(tex.get_width())
	var th := float(tex.get_height())
	return Rect2(0.28 * tw, 0.06 * th, 0.38 * tw, 0.88 * th)


static func apply_magenta_chroma(sprite: CanvasItem) -> void:
	var m := ShaderMaterial.new()
	m.shader = _CHROMA_SHADER
	sprite.material = m


const GAME_WIDTH := 960
const GAME_HEIGHT := 540
const TILE_SIZE := 16
const TILE_SCALE := 2

static func tile_world_size(room_data: Dictionary) -> int:
	var ts: int = int(room_data.get("tileSize", TILE_SIZE))
	return ts * TILE_SCALE

const HUMAN := {
	"width": 64,
	"height": 96,
	"speed": 200.0,
	"decel": 1500.0,
	"jump_velocity": -400.0,
	"max_fall_speed": 600.0,
	"gravity": 980.0,
	"coyote_ms": 80.0,
	"jump_buffer_ms": 100.0,
	"detection_range_multiplier": 1.0,
}

const CAT := {
	"width": 72,
	"height": 48,
	"speed": 320.0,
	"decel": 1000.0,
	"jump_velocity": -550.0,
	"max_fall_speed": 600.0,
	"gravity": 980.0,
	"coyote_ms": 80.0,
	"jump_buffer_ms": 100.0,
	"detection_range_multiplier": 0.5,
}

const TRANSFORM_COOLDOWN_MS := 500.0

const GUARD := {
	"cone_angle": PI / 2.0,
	"detection_range": 200.0,
	"speed": 80.0,
	"wait_duration": 1.5,
}

const LASER := {
	"default_on_duration": 2.0,
	"default_off_duration": 1.5,
}
