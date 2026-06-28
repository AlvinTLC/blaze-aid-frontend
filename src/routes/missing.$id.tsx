import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'

import { missingPersonQuery } from '@/api/queries'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DetailField,
  DetailLayout,
  DetailSkeleton,
} from '@/components/catalog/detail-layout'
import { formatDateTime } from '@/lib/format'

export const Route = createFileRoute('/missing/$id')({
  component: MissingDetailPage,
})

function MissingDetailPage() {
  const { id } = useParams({ from: '/missing/$id' })
  const { data, isLoading, isError } = useQuery(missingPersonQuery(id))

  if (isLoading) return <DetailSkeleton />
  if (isError || !data) {
    return (
      <DetailLayout back="/missing" title="Reporte no encontrado">
        <p className="text-sm text-muted-foreground">
          No pudimos encontrar este reporte.
        </p>
      </DetailLayout>
    )
  }

  const isFound = data.status === 'found'

  return (
    <DetailLayout
      back="/missing"
      title={data.full_name}
      badges={
        <Badge
          variant={isFound ? 'secondary' : 'destructive'}
          className="font-normal"
        >
          {data.status}
        </Badge>
      }
    >
      <div className="flex gap-4">
        <div className="size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
          {data.photo_url ? (
            <img
              src={data.photo_url}
              alt={`Foto de ${data.full_name}`}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="text-sm text-muted-foreground">
          {data.age != null ? (
            <p className="text-foreground">{data.age} años</p>
          ) : null}
          {data.last_seen_region ? (
            <p className="mt-1 inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              Vista por última vez en {data.last_seen_region}
            </p>
          ) : null}
          {data.last_seen_at ? (
            <p className="mt-1">{formatDateTime(data.last_seen_at)}</p>
          ) : null}
        </div>
      </div>

      {data.description ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="pt-6">
          <dl className="space-y-2">
            {data.lat != null && data.lng != null ? (
              <DetailField
                label="Última ubicación"
                value={
                  <span className="font-mono">
                    {data.lat}, {data.lng}
                  </span>
                }
              />
            ) : null}
            <DetailField label="Fuente" value={data.source} />
            <DetailField label="Contacto" value={data.contact || 'No disponible'} />
            <DetailField label="Reportado" value={formatDateTime(data.created_at)} />
          </dl>
        </CardContent>
      </Card>
    </DetailLayout>
  )
}
