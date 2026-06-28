import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ExternalLink, MapPin } from 'lucide-react'

import { projectQuery } from '@/api/queries'
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

export const Route = createFileRoute('/projects/$id')({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { id } = useParams({ from: '/projects/$id' })
  const { data, isLoading, isError } = useQuery(projectQuery(id))

  if (isLoading) return <DetailSkeleton />
  if (isError || !data) {
    return (
      <DetailLayout back="/projects" title="Proyecto no encontrado">
        <p className="text-sm text-muted-foreground">
          No pudimos encontrar este proyecto.
        </p>
      </DetailLayout>
    )
  }

  return (
    <DetailLayout
      back="/projects"
      title={data.title}
      badges={
        <>
          {data.category ? (
            <Badge variant="secondary" className="font-normal">
              {data.category}
            </Badge>
          ) : null}
          <Badge variant="outline" className="font-normal">
            {data.status}
          </Badge>
        </>
      }
    >
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
            {data.url ? (
              <DetailField
                label="Enlace"
                value={
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blaze hover:underline"
                  >
                    Abrir <ExternalLink className="size-3" aria-hidden />
                  </a>
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
