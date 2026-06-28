import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin, Package } from 'lucide-react'

import type { components } from '@/api/schema'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Resource = components['schemas']['Resource']

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link to="/resources/$id" params={{ id: resource.id }} className="group">
      <Card className="h-full gap-2 py-4 transition-colors hover:border-blaze-gold/50 hover:bg-accent/40">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-medium leading-snug">
              {resource.name}
            </h3>
            <Package className="size-4 shrink-0 text-blaze-gold" aria-hidden />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {resource.type ? (
              <Badge variant="secondary" className="font-normal">
                {resource.type}
              </Badge>
            ) : null}
            {resource.quantity != null ? (
              <Badge variant="outline" className="font-mono font-normal">
                {resource.quantity} {resource.unit}
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {resource.region || '—'}
            </span>
            <span className="inline-flex items-center gap-1 text-blaze-gold opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalle
              <ArrowRight className="size-3" aria-hidden />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
