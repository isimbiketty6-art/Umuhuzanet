const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!base) throw new Error('API is not configured')
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers || {})
    },
    credentials: 'include'
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}
