import type { components } from '@/api/schema'

export type Stats = components['schemas']['StatsData']

export interface RegionTotal {
  region: string
  total: number
  /** Entity breakdown, available only on the post-deploy region-outer shape. */
  entities?: Record<string, number>
}

/**
 * Normalize `by_region` into a region → total list.
 *
 * The backend emits two shapes:
 *  - Pre-fly-deploy (live now, commit before ad40a4d):
 *      `{ entity: { region: count } }`  (entidad-outer) → cross-sum by region.
 *  - Post-deploy (ad40a4d, needs owner `fly deploy`):
 *      `{ region: { projects, resources, missing, volunteers, total } }`.
 *
 * Detection: if the first inner object has a `total` key we assume region-outer.
 * This lets the UI keep working across the deploy with no code change.
 */
export function computeRegionTotals(
  byRegion: Stats['by_region'] | undefined | null,
): RegionTotal[] {
  if (!byRegion) return []
  const entries = Object.entries(byRegion)
  if (entries.length === 0) return []

  const sample = entries[0]?.[1]
  const isRegionOuter =
    !!sample && typeof sample === 'object' && 'total' in sample

  if (isRegionOuter) {
    return entries
      .map(([region, raw]) => {
        const value = (raw ?? {}) as Record<string, number>
        const { total, ...entities } = value
        return {
          region,
          total: typeof total === 'number' ? total : 0,
          entities,
        }
      })
      .sort((a, b) => b.total - a.total)
  }

  // entidad-outer → cross-sum into a region → total map
  const totals: Record<string, number> = {}
  for (const entityMap of Object.values(byRegion)) {
    for (const [region, count] of Object.entries(entityMap ?? {})) {
      totals[region] = (totals[region] ?? 0) + (count ?? 0)
    }
  }
  return Object.entries(totals)
    .map(([region, total]) => ({ region, total }))
    .sort((a, b) => b.total - a.total)
}

export type RecentKind = 'projects' | 'resources' | 'missing' | 'volunteers'

export interface RecentEntry {
  kind: RecentKind
  id: string
  title: string
  subtitle: string
  region?: string
  status?: string
  createdAt?: string
}

export const RECENT_KIND_META: Record<
  RecentKind,
  { label: string; icon: string }
> = {
  projects: { label: 'Proyecto', icon: 'HeartHandshake' },
  resources: { label: 'Recurso', icon: 'Package' },
  missing: { label: 'Desaparecido', icon: 'Search' },
  volunteers: { label: 'Voluntario', icon: 'Users' },
}

/** Flatten the four `recent` arrays into one time-sorted activity feed. */
export function flattenRecent(
  recent: Stats['recent'] | undefined | null,
): RecentEntry[] {
  if (!recent) return []
  const out: RecentEntry[] = []

  for (const p of recent.projects ?? []) {
    out.push({
      kind: 'projects',
      id: p.id,
      title: p.title,
      subtitle: p.category || p.description || '',
      region: p.region,
      status: p.status,
      createdAt: p.created_at,
    })
  }
  for (const r of recent.resources ?? []) {
    out.push({
      kind: 'resources',
      id: r.id,
      title: r.name,
      subtitle: [r.quantity != null && `${r.quantity}`, r.unit, r.type]
        .filter(Boolean)
        .join(' · '),
      region: r.region,
      status: r.status,
      createdAt: r.created_at,
    })
  }
  for (const m of recent.missing ?? []) {
    out.push({
      kind: 'missing',
      id: m.id,
      title: m.full_name,
      subtitle: m.description || (m.age != null ? `${m.age} años` : ''),
      region: m.last_seen_region,
      status: m.status,
      createdAt: m.created_at,
    })
  }
  for (const v of recent.volunteers ?? []) {
    out.push({
      kind: 'volunteers',
      id: v.id,
      title: v.full_name,
      subtitle: (v.skills ?? []).join(', '),
      region: v.region,
      status: v.status,
      createdAt: v.created_at,
    })
  }

  return out.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}
