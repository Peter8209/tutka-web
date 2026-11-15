/** Normalize an international phone number; format validation only, not ownership. */
export function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 48) return null;
  const raw = value.trim();
  if (!/^[+0-9() .\-\u00a0\u202f]+$/.test(raw)) return null;
  const compact = raw.replace(/[() .\-\u00a0\u202f]/g, '');
  const normalized = compact.startsWith('00') ? '+' + compact.slice(2) : compact;
  return /^\+[1-9][0-9]{6,14}$/.test(normalized) ? normalized : null;
}
