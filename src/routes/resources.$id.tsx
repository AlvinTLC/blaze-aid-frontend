import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'

import { resourceQuery } from '@/api/queries'
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

export const Route = createFileRoute('/resources/$id')({
  component: ResourceDetailPage,
})

function ResourceDetailPage() {
  const { id } = useParams({ from: '/resources/$id' })
  const { data, isLoading, isError } = useQuery(resourceQuery(id))

  if (isLoading) return <DetailSkeleton />
  if (isError || !data) {
    return (
      <DetailLayout back="/resources" title="Recurso no encontrado">
        <p className="text-sm text-muted-foreground">
          No pudimos encontrar este recurso.
        </p>
      </DetailLayout>
    )
  }

  return (
    <DetailLayout
      back="/resources"
      title={data.name}
      badges={
        <>
          {data.type ? (
            <Badge variant="secondary" className="font-normal">
              {data.type}
            </Badge>
          ) : null}
          <Badge variant="outline" className="font-normal">
            {data.status}
          </Badge>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cantidad disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-2xl tabular-nums">
            {data.quantity}{' '}
            <span className="text-base text-muted-foreground">{data.unit}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <dl className="space-y-2">
            <DetailField
              label="Región"
              value={
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" aria-hidden />
                  {data.region}
                </span>
              }
            />
            {data.lat != null && data.lng != null ? (
              <DetailField
                label="Coordenadas"
                value={
                  <span className="font-mono">
                    {data.lat}, {data.lng}
                  </span>
                }
              />
            ) : null}
            <DetailField label="Fuente" value={data.source} />
            <DetailField label="Contacto" value={data.contact || 'No disponible'} />
            <DetailField label="Actualizado" value={formatDateTime(data.updated_at)} />
          </dl>
        </CardContent>
      </Card>
    </DetailLayout>
  )
}
