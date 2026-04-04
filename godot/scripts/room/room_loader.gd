class_name RoomLoader
extends RefCounted


static func resolve_room_json_path(manifest_path: String) -> String:
	## manifest paths look like "assets/rooms/room_cell_01.json"
	var fname := manifest_path.get_file()
	return "res://data/rooms/%s" % fname


static func load_room_json(res_path: String) -> Dictionary:
	var f := FileAccess.open(res_path, FileAccess.READ)
	if f == null:
		push_error("RoomLoader: cannot open %s" % res_path)
		return {}
	var data = JSON.parse_string(f.get_as_text())
	if typeof(data) != TYPE_DICTIONARY:
		return {}
	return RoomNormalize.normalize(data)


static func load_room_by_id(room_id: String, manifest: Dictionary) -> Dictionary:
	var rooms: Variant = manifest.get("rooms", {})
	if typeof(rooms) != TYPE_DICTIONARY:
		return {}
	var entry: Variant = rooms.get(room_id, {})
	var path: String
	if typeof(entry) == TYPE_DICTIONARY and entry.has("path"):
		path = resolve_room_json_path(str(entry["path"]))
	else:
		path = "res://data/rooms/%s.json" % room_id
	return load_room_json(path)


static func list_room_ids(manifest: Dictionary) -> PackedStringArray:
	var rooms: Variant = manifest.get("rooms", {})
	if typeof(rooms) != TYPE_DICTIONARY:
		return PackedStringArray()
	var keys := rooms.keys()
	keys.sort()
	var out := PackedStringArray()
	for k in keys:
		out.append(str(k))
	return out
