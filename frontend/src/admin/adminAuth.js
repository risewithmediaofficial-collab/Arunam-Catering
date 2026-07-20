// ─────────────────────────────────────────────
//  Arunam Admin — Auth helpers (sessionStorage)
// ─────────────────────────────────────────────

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'arunam@2024'
const SESSION_KEY    = 'arunam_admin_session'

/**
 * Validates credentials and stores session.
 * @returns {boolean} true if login succeeded
 */
export function login(username, password) {
  if (
    username.trim() === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ username: username.trim(), loginAt: new Date().toISOString() })
    )
    return true
  }
  return false
}

/** Removes session from sessionStorage */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

/** Returns true if a valid session exists */
export function isLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY)
}

/** Returns the logged-in admin's username or null */
export function getAdminName() {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw).username
  } catch {
    return null
  }
}
