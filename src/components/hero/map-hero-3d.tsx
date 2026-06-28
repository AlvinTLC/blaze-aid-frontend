import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, MousePointerClick } from 'lucide-react'

import { venezuelaGeoQuery } from '@/api/queries'
import { VenezuelaMap } from '@/components/venezuela-map'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatNumber } from '@/lib/format'
import type { RegionTotal } from '@/lib/stats'

import type { MapItem } from './map-hero-scene'

const MapHeroScene = lazy(() =>
  import('./map-hero-scene').then((m) => ({ default: m.MapHeroScene })),
)

function useEnable3D(): boolean {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCores = (navigator.hardwareConcurrency ?? 4) <= 2
    setEnabled(!reduce && !lowCores)
  }, [])
  return enabled
}

interface MapHero3DProps {
  regions: RegionTotal[]
  isLoading: boolean
}

export function MapHero3D({ regions, isLoading }: MapHero3DProps) {
  const enabled = useEnable3D()
  const { data: geo } = useQuery(venezuelaGeoQuery)

  const [hovered, setHovered] = useState<MapItem | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)
  const [selected, setSelected] = useState<MapItem | null>(null)

  const maxTotal = regions.reduce((m, r) => Math.max(m, r.total), 0)
  const totalAll = regions.reduce((s, r) => s + r.total, 0)

  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden border-b">
      {/* ambient backdrop (also the loading / fallback base) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background"
      >
        <div className="absolute left-1/2 top-[10%] h-[34rem] w-[68rem] -translate-x-1/2 rounded-full bg-blaze/15 blur-[140px] dark:bg-blaze/10" />
        <div className="absolute left-[25%] top-[30%] h-[22rem] w-[42rem] -translate-x-1/2 rounded-full bg-blaze-blue/15 blur-[140px] dark:bg-blaze-blue/10" />
      </div>

      {/* 3D map (or 2D / skeleton fallback) */}
      <div className="absolute inset-0">
        {!geo || isLoading ? (
          <Skeleton className="h-full w-full rounded-none" />
        ) : enabled ? (
          <Suspense
            fallback={<Skeleton className="h-full w-full rounded-none" />}
          >
            <MapHeroScene
              geo={geo}
              regions={regions}
              hoveredKey={hovered?.key ?? null}
              selectedKey={selected?.key ?? null}
              onHover={(item, x, y) => {
                setHovered(item)
                if (item && x != null && y != null) setHoverPos({ x, y })
              }}
              onSelect={(item) => setSelected(item)}
            />
          </Suspense>
        ) : (
          <div className="grid h-full place-items-center p-6">
            <div className="w-full max-w-5xl">
              <VenezuelaMap regions={regions} />
            </div>
          </div>
        )}
      </div>

      {/* overlay (non-blocking; buttons opt back in) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
        {/* title */}
        <div className="max-w-xl">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-blaze" />
            Datos en vivo · Venezuela
          </Badge>
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Ayuda humanitaria{' '}
            <span className="bg-gradient-to-r from-blaze via-blaze-gold to-blaze-blue bg-clip-text text-transparent">
              por estado
            </span>
          </h1>
          <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
            Explora proyectos, recursos, personas desaparecidas y voluntarios
            en todo el país.
          </p>
          <div className="pointer-events-auto mt-5 flex flex-wrap gap-3">
            <Button size="sm" asChild>
              <Link to="/missing">
                Buscar desaparecidos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/projects">Ver proyectos</Link>
            </Button>
          </div>
        </div>

        {/* bottom bar: legend + hint */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="rounded-lg border bg-background/70 p-3 backdrop-blur">
            <div className="flex items-center justify-between gap-6 text-[11px] text-muted-foreground">
              <span>menor</span>
              <span>mayor actividad</span>
            </div>
            <div
              className="mt-1 h-2.5 w-44 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, #20222b, var(--color-blaze))',
              }}
            />
            <p className="mt-2 font-mono text-xs tabular-nums">
              {formatNumber(totalAll)} registros · {regions.length} estados
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-background/70 px-3 py-2 text-[11px] text-muted-foreground backdrop-blur">
            <MousePointerClick className="size-3.5" />
            Arrastra para girar · scroll para zoom · clic en un estado
          </div>
        </div>
      </div>

      {/* hover tooltip (viewport coords) */}
      {hovered && hoverPos ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[130%] rounded-lg border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <p className="font-medium">{hovered.name}</p>
          <p className="font-mono tabular-nums text-blaze">
            {formatNumber(hovered.total)} registros
          </p>
          {maxTotal > 0 ? (
            <p className="text-[10px] text-muted-foreground">
              {Math.round(hovered.ratio * 100)}% del máximo
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
