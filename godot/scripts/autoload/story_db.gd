extends Node
## Loads `res://data/story/*.json` for terminals, monologues, and ending sequence.

var _terminal_root: Dictionary = {}
var _monologue_entries: Array = []
var _ending_lines: Array = []


func _ready() -> void:
	_terminal_root = _load_json("res://data/story/terminal_logs.json")
	var mono: Dictionary = _load_json("res://data/story/monologue.json")
	var entries: Variant = mono.get("entries", [])
	_monologue_entries = entries if typeof(entries) == TYPE_ARRAY else []
	var end_d: Dictionary = _load_json("res://data/story/ending.json")
	var el: Variant = end_d.get("lines", [])
	_ending_lines = el if typeof(el) == TYPE_ARRAY else []


func _load_json(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		push_warning("StoryDB: missing %s" % path)
		return {}
	var f := FileAccess.open(path, FileAccess.READ)
	if f == null:
		return {}
	var data = JSON.parse_string(f.get_as_text())
	return data if typeof(data) == TYPE_DICTIONARY else {}


## Title + body lines for HUD terminal overlay (flavor `logs` or `chimera_research` entry).
func get_terminal_display(log_id: String) -> Dictionary:
	if log_id == "":
		return {}
	var logs: Variant = _terminal_root.get("logs", {})
	if typeof(logs) == TYPE_DICTIONARY and (logs as Dictionary).has(log_id):
		var block: Variant = (logs as Dictionary)[log_id]
		if typeof(block) != TYPE_DICTIONARY:
			return {}
		var b: Dictionary = block
		return {
			"title": str(b.get("title", "LOG")),
			"body": _join_lines(b.get("lines", [])),
		}
	var research: Variant = _terminal_root.get("chimera_research", [])
	if typeof(research) == TYPE_ARRAY:
		for item in research:
			if typeof(item) != TYPE_DICTIONARY:
				continue
			var e: Dictionary = item
			if str(e.get("id", "")) != log_id:
				continue
			var hdr := "%s — %s (%s)" % [
				str(e.get("date", "")),
				str(e.get("author", "")),
				str(e.get("title", "")),
			]
			return {
				"title": hdr.strip_edges(),
				"body": _join_lines(e.get("lines", [])),
			}
	return {}


func _join_lines(lines: Variant) -> String:
	if typeof(lines) != TYPE_ARRAY:
		return ""
	var parts: PackedStringArray = PackedStringArray()
	for line in lines:
		parts.append(str(line))
	return "\n".join(parts)


func get_monologue_for_room(room_id: String) -> String:
	var trig := "room_entry:%s" % room_id
	for item in _monologue_entries:
		if typeof(item) != TYPE_DICTIONARY:
			continue
		var e: Dictionary = item
		if str(e.get("trigger", "")) != trig:
			continue
		return str(e.get("text", ""))
	return ""


func get_ending_lines() -> Array:
	return _ending_lines.duplicate(true)
