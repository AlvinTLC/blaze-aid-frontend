import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin, User } from 'lucide-react'

import type { components } from '@/api/schema'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Volunteer = components['schemas']['Volunteer']

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const skills = volunteer.skills ?? []
  return (
    <Link to="/volunteers/$id" params={{ id: volunteer.id }} className="group">
      <Card className="h-full gap-2 py-4 transition-colors hover:border-blaze-blue/50 hover:bg-accent/40">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-muted text-blaze-blue">
                <User className="size-4" aria-hidden />
              </span>
              <h3 className="font-medium leading-snug">{volunteer.full_name}</h3>
            </div>
          </div>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {volunteer.region || '—'}
              {volunteer.availability ? ` · ${volunteer.availability}` : ''}
            </span>
            <span className="inline-flex items-center gap-1 text-blaze-blue opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalle
              <ArrowRight className="size-3" aria-hidden />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
