import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin, UserSearch } from 'lucide-react'

import type { components } from '@/api/schema'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Person = components['schemas']['Person']

export function PersonCard({ person }: { person: Person }) {
  const isFound = person.status === 'found'
  return (
    <Link to="/missing/$id" params={{ id: person.id }} className="group">
      <Card className="h-full gap-2 py-4 transition-colors hover:border-destructive/40 hover:bg-accent/40">
        <CardContent className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              {person.photo_url ? (
                <img
                  src={person.photo_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-muted-foreground">
                  <UserSearch className="size-5" aria-hidden />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium leading-snug">
                {person.full_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {person.age != null ? `${person.age} años` : 'Edad desconocida'}
              </p>
            </div>
            <Badge
              variant={isFound ? 'secondary' : 'destructive'}
              className="font-normal"
            >
              {person.status || 'missing'}
            </Badge>
          </div>
          {person.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {person.description}
            </p>
          ) : null}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {person.last_seen_region || '—'}
            </span>
            <span className="inline-flex items-center gap-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalle
              <ArrowRight className="size-3" aria-hidden />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
