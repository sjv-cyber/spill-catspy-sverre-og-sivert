const STORAGE_KEY = 'catspy_progress_v1'

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { visits: {}, flags: {}, sliceCompletes: 0 }
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return { visits: {}, flags: {}, sliceCompletes: 0 }
    o.visits = o.visits && typeof o.visits === 'object' ? o.visits : {}
    o.flags = o.flags && typeof o.flags === 'object' ? o.flags : {}
    o.sliceCompletes = Number(o.sliceCompletes) || 0
    return o
  } catch (_) {
    return { visits: {}, flags: {}, sliceCompletes: 0 }
  }
}

function write(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {
    /* private mode / quota */
  }
}

/**
 * @param {string} roomId
 */
export function markRoomVisited(roomId) {
  if (!roomId) return
  const o = read()
  o.visits[roomId] = (o.visits[roomId] || 0) + 1
  o.lastRoom = roomId
  o.lastVisitAt = Date.now()
  write(o)
}

export function markSliceComplete() {
  const o = read()
  o.sliceCompletes = (o.sliceCompletes || 0) + 1
  o.lastCompleteAt = Date.now()
  write(o)
}

/**
 * @param {string} flag
 */
export function setProgressFlag(flag, value = true) {
  const o = read()
  o.flags[flag] = !!value
  write(o)
}

/**
 * @param {string} flag
 */
export function hasProgressFlag(flag) {
  return !!read().flags[flag]
}

export function getProgressSnapshot() {
  return read()
}
