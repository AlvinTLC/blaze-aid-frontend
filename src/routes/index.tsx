import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowRight,
  HeartHandshake,
  Package,
  Search,
  Users,
} from 'lucide-react'

import { statsQuery } from '@/api/queries'
import { AnimatedCounter } from '@/components/animated-counter'
import { MapHero3D } from '@/components/hero/map-hero-3d'
import { RecentFeed } from '@/components/recent-feed'
import { TimelineChart } from '@/components/timeline-chart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { computeRegionTotals, flattenRecent } from '@/lib/stats'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

const COUNT_CARDS = [
  {
    key: 'projects',
    label: 'Proyectos de ayuda',
    href: '/projects',
    icon: HeartHandshake,
    accent: 'text-blaze',
  },
  {
    key: 'resources',
    label: 'Recursos',
    href: '/resources',
    icon: Package,
    accent: 'text-blaze-gold',
  },
  {
    key: 'missing',
    label: 'Personas desaparecidas',
    href: '/missing',
    icon: Search,
    accent: 'text-destructive',
  },
  {
    key: 'volunteers',
    label: 'Voluntarios',
    href: '/volunteers',
    icon: Users,
    accent: 'text-blaze-blue',
  },
] as const

function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery(statsQuery)

  const counts = data?.counts ?? {}
  const regions = computeRegionTotals(data?.by_region)
  const recent = flattenRecent(data?.recent)

  return (
    <div className="relative">
      {/* hero: interactive 3D Venezuela map */}
      <MapHero3D regions={regions} isLoading={isLoading} />

      {/* counts */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COUNT_CARDS.map((card) => {
            const Icon = card.icon
            const value = counts[card.key] ?? 0
            return (
              <Card key={card.key} className="gap-0 py-5">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Icon className={`size-4 ${card.accent}`} aria-hidden />
                    <span>{card.label}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between">
                  {isError ? (
                    <span className="text-sm text-destructive">Sin datos</span>
                  ) : isLoading ? (
                    <Skeleton className="h-9 w-20" />
                  ) : (
                    <AnimatedCounter
                      value={value}
                      className="font-mono text-3xl font-semibold tabular-nums tracking-tight"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-muted-foreground"
                  >
                    <Link to={card.href}>
                      Ver
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {isError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            No pudimos conectar con el servicio de datos.
            <span className="hidden text-muted-foreground sm:inline">
              {String((error as Error)?.message ?? '')}
            </span>
          </div>
        )}
      </section>

      {/* activity: timeline + recent feed */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>
                Eventos registrados en los últimos días.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <TimelineChart timeline={data?.timeline} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Últimas novedades</CardTitle>
              <CardDescription>Lo que acaba de llegar.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentFeed entries={recent} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
