import { createFileRoute, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin } from 'lucide-react'

import { volunteerQuery } from '@/api/queries'
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

export const Route = createFileRoute('/volunteers/$id')({
  component: VolunteerDetailPage,
})

function VolunteerDetailPage() {
  const { id } = useParams({ from: '/volunteers/$id' })
  const { data, isLoading, isError } = useQuery(volunteerQuery(id))

  if (isLoading) return <DetailSkeleton />
  if (isError || !data) {
    return (
      <DetailLayout back="/volunteers" title="Voluntario no encontrado">
        <p className="text-sm text-muted-foreground">
          No pudimos encontrar este voluntario.
        </p>
      </DetailLayout>
    )
  }

  const skills = data.skills ?? []

  return (
    <DetailLayout
      back="/volunteers"
      title={data.full_name}
      badges={
        <>
          <Badge variant="outline" className="font-normal">
            {data.status}
          </Badge>
          {data.availability ? (
            <Badge variant="secondary" className="font-normal">
              {data.availability}
            </Badge>
          ) : null}
        </>
      }
    >
      {skills.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
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
            <DetailField label="Fuente" value={data.source} />
            <DetailField label="Contacto" value={data.contact || 'No disponible'} />
            <DetailField label="Actualizado" value={formatDateTime(data.updated_at)} />
          </dl>
        </CardContent>
      </Card>
    </DetailLayout>
  )
}
