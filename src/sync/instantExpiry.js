/** App InstantDB padrão da sala VERDAO. Expirou em 2026-10-01. */
export const DEFAULT_INSTANT_APP_ID = '5b938cde-137c-4fbf-9866-982c2071d4aa'
export const INSTANT_EXPIRES_ISO = '2026-10-01T00:12:37.343Z'

export function isCustomInstantApp(appId) {
  const id = String(appId || '').trim()
  return Boolean(id) && id !== DEFAULT_INSTANT_APP_ID
}

/** Sync entre aparelhos só vale com app próprio, ou enquanto o padrão não venceu. */
export function isInstantExpiredAt(nowMs, appId) {
  if (isCustomInstantApp(appId)) return false
  const exp = new Date(INSTANT_EXPIRES_ISO).getTime()
  if (Number.isNaN(exp)) return false
  return nowMs > exp
}
