class_name RoomNormalize
extends RefCounted
## Subset of src/systems/roomMetadata.js normalization for Godot runtime.


static func normalize(room_data: Dictionary) -> Dictionary:
	var d := room_data.duplicate(true)
	d["room_id"] = str(d.get("room_id", d.get("id", "")))
	d["room_type"] = str(d.get("room_type", "normal"))
	d["supports_retreat"] = d.get("supports_retreat", false) == true
	d["lock_behavior"] = str(d.get("lock_behavior", "none"))
	var es: Variant = d.get("entry_spawns", {})
	d["entry_spawns"] = es if typeof(es) == TYPE_DICTIONARY else {}
	var est: Variant = d.get("extra_solid_tiles", [])
	d["extra_solid_tiles"] = est if typeof(est) == TYPE_ARRAY else []
	d["exit_locked"] = false
	d["boss_engaged"] = false
	return d
