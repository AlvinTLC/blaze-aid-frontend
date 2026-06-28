import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { venezuelaGeoQuery } from '@/api/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import {
  type GeoFeature,
  computeBounds,
  geometryToPath,
  normalizeName,
} from '@/lib/geo'
import type { RegionTotal } from '@/lib/stats'

interface VenezuelaMapProps {
  regions: RegionTotal[]
}

interface FeaturePath {
  name: string
  key: string
  d: string
  total: number
  ratio: number
}

function buildPaths(
  features: GeoFeature[],
  lookup: Map<string, RegionTotal>,
  maxTotal: number,
): FeaturePath[] {
  return features.map((feature) => {
    const name = feature.properties.shapeName
    const key = normalizeName(name)
    const total = lookup.get(key)?.total ?? 0
    return {
      name,
      key,
      d: geometryToPath(feature.geometry),
      total,
      ratio: maxTotal > 0 ? total / maxTotal : 0,
    }
  })
}

export function VenezuelaMap({ regions }: VenezuelaMapProps) {
  const { data: geo, isLoading, isError } = useQuery(venezuelaGeoQuery)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const lookup = useMemo(() => {
    const map = new Map<string, RegionTotal>()
    for (const r of regions) map.set(normalizeName(r.region), r)
    return map
  }, [regions])

  const maxTotal = useMemo(
    () => regions.reduce((max, r) => Math.max(max, r.total), 0),
    [regions],
  )

  const bounds = useMemo(
    () => (geo ? computeBounds(geo.features) : null),
    [geo],
  )

  const paths = useMemo(
    () => (geo ? buildPaths(geo.features, lookup, maxTotal) : []),
    [geo, lookup, maxTotal],
  )

  const focusKey = hovered ?? selected
  const focusPath = paths.find((p) => p.key === focusKey) ?? null

  if (isError) {
    return (
      <div className="grid h-72 place-items-center text-sm text-muted-foreground">
        No se pudo cargar el mapa.
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="relative">
        {isLoading || !bounds ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <svg
            viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-72 w-full lg:h-[22rem]"
            role="img"
            aria-label="Mapa de Venezuela por estado"
          >
            {paths.map((path) => {
              const isFocus = path.key === focusKey
              const fillPct = Math.round(path.ratio * 100)
              return (
                <path
                  key={path.key}
                  d={path.d}
                  fill={`color-mix(in oklch, var(--color-blaze) ${fillPct}%, var(--color-muted))`}
                  stroke={
                    isFocus ? 'var(--color-blaze-gold)' : 'var(--color-background)'
                  }
                  strokeWidth={isFocus ? 0.06 : 0.025}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-[fill] duration-150"
                  style={{ filter: isFocus ? 'brightness(1.15)' : undefined }}
                  onMouseEnter={() => setHovered(path.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    setSelected((s) => (s === path.key ? null : path.key))
                  }
                  tabIndex={0}
                  onFocus={() => setHovered(path.key)}
                  onBlur={() => setHovered(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelected((s) => (s === path.key ? null : path.key))
                    }
                  }}
                >
                  <title>{`${path.name}: ${formatNumber(path.total)}`}</title>
                </path>
              )
            })}
          </svg>
        )}
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="rounded-lg border bg-muted/40 p-4">
          {focusPath ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {selected ? 'Estado seleccionado' : 'Estado'}
              </p>
              <p className="mt-1 text-lg font-semibold">{focusPath.name}</p>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums text-blaze">
                {formatNumber(focusPath.total)}
              </p>
              <p className="text-xs text-muted-foreground">registros totales</p>
            </div>
          ) : (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Venezuela
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatNumber(regions.reduce((s, r) => s + r.total, 0))}
              </p>
              <p className="text-xs text-muted-foreground">
                registros en total. Pasa el cursor sobre un estado.
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>menor</span>
            <span>mayor actividad</span>
          </div>
          <div
            className="mt-1 h-2.5 w-full rounded-full"
            style={{
              background:
                'linear-gradient(to right, var(--color-muted), var(--color-blaze))',
            }}
          />
        </div>

        {regions.length > 0 && (
          <ol className="max-h-40 space-y-1 overflow-y-auto pr-1 text-sm">
            {regions.slice(0, 6).map((r) => (
              <li
                key={r.region}
                className="flex items-center justify-between gap-2"
              >
                <span className="truncate text-muted-foreground">{r.region}</span>
                <span className="font-mono tabular-nums">
                  {formatNumber(r.total)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
