/**
 * Normalizes designer-facing room JSON into a consistent runtime shape.
 * @param {object} raw
 * @returns {object}
 */
export function normalizeRoomData(raw) {
  const d = raw && typeof raw === 'object' ? raw : {}
  const entities = d.entities && typeof d.entities === 'object' ? d.entities : {}

  const entitySummary = []
  if (Array.isArray(entities.guards) && entities.guards.length) entitySummary.push('guards')
  if (Array.isArray(entities.cameras) && entities.cameras.length) entitySummary.push('cameras')
  if (Array.isArray(entities.scientists) && entities.scientists.length) entitySummary.push('scientists')
  if (Array.isArray(entities.mutants) && entities.mutants.length) entitySummary.push('mutants')
  if (Array.isArray(entities.robots) && entities.robots.length) entitySummary.push('robots')
  if (Array.isArray(entities.hideZones) && entities.hideZones.length) entitySummary.push('hide_zones')
  if (Array.isArray(d.interactables) && d.interactables.length) entitySummary.push('interactables')

  return {
    ...d,
    room_id: d.room_id ?? d.id,
    room_type: d.room_type ?? 'normal',
    exits: Array.isArray(d.exits) ? d.exits : [],
    /** Declared state machine vocabulary (documentation / tools). */
    states: Array.isArray(d.states)
      ? d.states
      : ['idle', 'aware', 'alert', 'combat', 'cleared', 'locked'],
    supports_retreat: d.supports_retreat === true,
    lock_behavior: d.lock_behavior ?? 'none',
    layout_tags: Array.isArray(d.layout_tags) ? d.layout_tags : [],
    dominant_interaction: d.dominant_interaction ?? null,
    entry_spawns: d.entry_spawns && typeof d.entry_spawns === 'object' ? d.entry_spawns : {},
    return_exit:
      d.return_exit &&
      typeof d.return_exit === 'object' &&
      typeof d.return_exit.target_room_id === 'string'
        ? d.return_exit
        : null,
    extra_solid_tiles: Array.isArray(d.extra_solid_tiles) ? d.extra_solid_tiles : [],
    danger_zone: d.danger_zone && typeof d.danger_zone === 'object' ? d.danger_zone : null,
    interaction_point: d.interaction_point && typeof d.interaction_point === 'object' ? d.interaction_point : null,
    cat_route_hint: d.cat_route_hint && typeof d.cat_route_hint === 'object' ? d.cat_route_hint : null,
    boss_trigger: d.boss_trigger && typeof d.boss_trigger === 'object' ? d.boss_trigger : null,
    entity_summary: Array.isArray(d.entity_summary) ? d.entity_summary : entitySummary,
  }
}

/**
 * Tile coords for player spawn when entering from a given room id.
 * @param {ReturnType<typeof normalizeRoomData>} roomData
 * @param {string | null | undefined} fromRoomId
 * @returns {{ x: number, y: number }}
 */
export function resolvePlayerSpawnTile(roomData, fromRoomId) {
  if (fromRoomId && roomData.entry_spawns[fromRoomId]) {
    const s = roomData.entry_spawns[fromRoomId]
    return { x: s.x, y: s.y }
  }
  return { x: roomData.playerSpawn.x, y: roomData.playerSpawn.y }
}

/**
 * Convert tile AABB to world pixel rect (top-left origin).
 */
export function tileRectToWorld(rect, tileWorldSize) {
  const x = rect.x * tileWorldSize
  const y = rect.y * tileWorldSize
  const w = (rect.w ?? rect.width ?? 1) * tileWorldSize
  const h = (rect.h ?? rect.height ?? 1) * tileWorldSize
  return { x, y, width: w, height: h }
}

export function playerCenterInTileRect(px, py, rect, tileWorldSize) {
  const r = tileRectToWorld(rect, tileWorldSize)
  return px >= r.x && px <= r.x + r.width && py >= r.y && py <= r.y + r.height
}
