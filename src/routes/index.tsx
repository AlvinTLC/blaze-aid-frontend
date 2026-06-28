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
import { RecentFeed } from '@/components/recent-feed'
import { TimelineChart } from '@/components/timeline-chart'
import { VenezuelaMap } from '@/components/venezuela-map'
import { Badge } from '@/components/ui/badge'
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
      {/* ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-blaze/20 blur-[120px] dark:bg-blaze/10" />
        <div className="absolute left-1/4 top-[-6rem] h-[20rem] w-[40rem] -translate-x-1/2 rounded-full bg-blaze-blue/20 blur-[120px] dark:bg-blaze-blue/10" />
      </div>

      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-5 gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-blaze" />
            Datos en vivo · Venezuela
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Ayuda humanitaria,
            <br />
            <span className="bg-gradient-to-r from-blaze via-blaze-gold to-blaze-blue bg-clip-text text-transparent">
              cuando más se necesita
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Un punto único para encontrar proyectos de ayuda, recursos,
            personas desaparecidas y voluntarios — organizados por estado en
            toda Venezuela.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to="/missing">
                Buscar desaparecidos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/projects">Ver proyectos</Link>
            </Button>
          </div>
        </div>
      </section>

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

      {/* regions */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Actividad por estado</CardTitle>
            <CardDescription>
              Mapa interactivo de Venezuela. Pasa el cursor o haz clic en un
              estado para ver su volumen de registros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : regions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aún no hay datos regionales para mostrar.
              </p>
            ) : (
              <VenezuelaMap regions={regions} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
