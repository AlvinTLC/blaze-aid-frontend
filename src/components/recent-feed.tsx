import { Link } from '@tanstack/react-router'
import {
  HeartHandshake,
  Package,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/format'
import {
  RECENT_KIND_META,
  type RecentEntry,
  type RecentKind,
} from '@/lib/stats'

const ICONS: Record<RecentKind, LucideIcon> = {
  projects: HeartHandshake,
  resources: Package,
  missing: Search,
  volunteers: Users,
}

const ICON_COLOR: Record<RecentKind, string> = {
  projects: 'text-blaze',
  resources: 'text-blaze-gold',
  missing: 'text-destructive',
  volunteers: 'text-blaze-blue',
}

const HREF: Record<RecentKind, string> = {
  projects: '/projects',
  resources: '/resources',
  missing: '/missing',
  volunteers: '/volunteers',
}

function FeedRow({ entry }: { entry: RecentEntry }) {
  const Icon = ICONS[entry.kind]
  return (
    <Link
      to={HREF[entry.kind]}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg bg-muted ${ICON_COLOR[entry.kind]}`}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{entry.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {entry.subtitle || RECENT_KIND_META[entry.kind].label}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        {entry.region ? (
          <Badge variant="outline" className="font-normal">
            {entry.region}
          </Badge>
        ) : null}
        <span className="text-[11px] text-muted-foreground">
          {formatRelative(entry.createdAt)}
        </span>
      </div>
    </Link>
  )
}

interface RecentFeedProps {
  entries: RecentEntry[]
  isLoading?: boolean
}

export function RecentFeed({ entries, isLoading }: RecentFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5">
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aún no hay actividad reciente para mostrar.
      </p>
    )
  }

  return (
    <div className="space-y-0.5">
      {entries.slice(0, 8).map((entry) => (
        <FeedRow key={`${entry.kind}-${entry.id}`} entry={entry} />
      ))}
    </div>
  )
}
