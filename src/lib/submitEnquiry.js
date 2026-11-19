export async function submitEnquiry(data) {
  const idempotencyKey = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, idempotencyKey }),
  })
  const result = await res.json().catch(() => ({}))
  if (!res.ok || !result.ok) throw new Error(result.error || 'Enquiry failed.')
}
