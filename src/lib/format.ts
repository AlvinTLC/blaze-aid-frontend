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
