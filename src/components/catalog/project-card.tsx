import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin } from 'lucide-react'

import type { components } from '@/api/schema'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

type Project = components['schemas']['AidProject']

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to="/projects/$id" params={{ id: project.id }} className="group">
      <Card className="h-full gap-2 py-4 transition-colors hover:border-blaze/50 hover:bg-accent/40">
        <CardContent className="space-y-2">
          <h3 className="line-clamp-2 font-medium leading-snug">
            {project.title}
          </h3>
          {project.category ? (
            <Badge variant="secondary" className="font-normal">
              {project.category}
            </Badge>
          ) : null}
          {project.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          ) : null}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" aria-hidden />
              {project.region || '—'}
            </span>
            <span className="inline-flex items-center gap-1 text-blaze opacity-0 transition-opacity group-hover:opacity-100">
              Ver detalle
              <ArrowRight className="size-3" aria-hidden />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
