import { useState } from 'react'
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { LocateFixed, SearchX, X } from 'lucide-react'

import { missingQuery } from '@/api/queries'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { PersonCard } from '@/components/catalog/person-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PAGE_SIZE, pageToOffset } from '@/lib/search'

interface MissingSearch {
  q?: string
  region?: string
  status?: string
  from?: string
  to?: string
  page?: number
  lat?: number
  lng?: number
  radius?: number
}

const RADII = [10, 25, 50, 100, 250]

export const Route = createFileRoute('/missing')({
  validateSearch: (input: Record<string, unknown>): MissingSearch => {
    const asStr = (v: unknown): string | undefined =>
      typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
    const asNum = (v: unknown): number | undefined => {
      if (v == null || v === '') return undefined
      const n = Number(v)
      return Number.isFinite(n) ? n : undefined
    }
    const asPosInt = (v: unknown): number | undefined => {
      const n = asNum(v)
      return n != null && n >= 1 ? Math.floor(n) : undefined
    }
    return {
      q: asStr(input['q']),
      region: asStr(input['region']),
      status: asStr(input['status']),
      from: asStr(input['from']),
      to: asStr(input['to']),
      page: asPosInt(input['page']),
      lat: asNum(input['lat']),
      lng: asNum(input['lng']),
      radius: asNum(input['radius']),
    }
  },
  component: MissingPage,
})

function MissingPage() {
  const search = useSearch({ from: '/missing' })
  const navigate = useNavigate({ from: '/missing' })
  const [locating, setLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  const page = search.page ?? 1
  const nearMeActive =
    search.lat != null && search.lng != null && (search.radius ?? 0) > 0

  const { data, isLoading, isError } = useQuery(
    missingQuery({
      q: search.q,
      region: search.region,
      status: search.status,
      from: search.from,
      to: search.to,
      limit: PAGE_SIZE,
      offset: pageToOffset(search.page),
      ...(nearMeActive
        ? {
            lat: search.lat,
            lng: search.lng,
            radius_km: search.radius ?? 50,
          }
        : {}),
    }),
  )

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const onLocate = () => {
    setGeoError(null)
    if (!('geolocation' in navigator)) {
      setGeoError('Tu navegador no soporta geolocalización.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        navigate({
          search: (prev) => ({
            ...prev,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            radius: prev.radius ?? 50,
            page: undefined,
          }),
          replace: true,
        })
      },
      () => {
        setLocating(false)
        setGeoError(
          'No pudimos obtener tu ubicación. Revisa los permisos del navegador.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const nearMeControl = (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card/50 p-3">
      <Button
        variant={nearMeActive ? 'default' : 'outline'}
        size="sm"
        onClick={onLocate}
        disabled={locating}
      >
        <LocateFixed className="size-4" aria-hidden />
        {locating
          ? 'Buscando...'
          : nearMeActive
            ? 'Cerca de mí (activo)'
            : 'Buscar cerca de mí'}
      </Button>
      {nearMeActive ? (
        <>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Radio
            <select
              value={search.radius ?? 50}
              onChange={(e) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    radius: Number(e.target.value),
                    page: undefined,
                  }),
                  replace: true,
                })
              }
              className={cn(
                'h-8 rounded-md border bg-transparent px-2 text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'outline-none',
              )}
            >
              {RADII.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                search: (prev) => {
                  const { lat, lng, radius, ...rest } = prev
                  void lat
                  void lng
                  void radius
                  return rest
                },
                replace: true,
              })
            }
          >
            <X className="size-3.5" aria-hidden />
            Quitar
          </Button>
          <span className="text-xs text-muted-foreground">
            Mostrando personas vistas cerca de tu ubicación.
          </span>
        </>
      ) : null}
      {geoError ? (
        <span className="text-xs text-destructive">{geoError}</span>
      ) : null}
    </div>
  )

  return (
    <CatalogPage
      title="Personas desaparecidas"
      description="Reportes de personas no localizadas. Usa «cerca de mí» para ver las últimas vistas cerca de ti."
      icon={SearchX}
      accentClass="text-destructive"
      items={items}
      isLoading={isLoading}
      isError={isError}
      total={total}
      page={page}
      totalPages={totalPages}
      q={search.q}
      region={search.region}
      status={search.status}
      from={search.from}
      to={search.to}
      headerExtra={nearMeControl}
      onFilterChange={(patch) =>
        navigate({
          search: (prev) => ({ ...prev, ...patch, page: undefined }),
          replace: true,
        })
      }
      onPageChange={(p) =>
        navigate({
          search: (prev) => ({ ...prev, page: p === 1 ? undefined : p }),
        })
      }
      onReset={() => navigate({ search: {}, replace: true })}
      renderItem={(m) => <PersonCard person={m} />}
      emptyIcon={SearchX}
    />
  )
}
