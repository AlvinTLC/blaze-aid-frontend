export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('es-VE').format(n)
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('es-VE', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n)
}

export function formatDate(
  iso: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('es-VE', opts).format(d)
}

export function formatDateTime(iso: string | null | undefined): string {
  return formatDate(iso, { dateStyle: 'medium', timeStyle: 'short' })
}

/** Coarse relative time in Spanish, e.g. "hace 3 h". */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diff = Date.now() - then
  const min = Math.round(diff / 60000)
  if (min < 1) return 'ahora mismo'
  if (min < 60) return `hace ${min} min`
  const hr = Math.round(min / 60)
  if (hr < 24) return `hace ${hr} h`
  const day = Math.round(hr / 24)
  if (day < 30) return `hace ${day} d`
  return formatDate(iso)
}
