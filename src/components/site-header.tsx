import { Link } from '@tanstack/react-router'
import { Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'

const NAV = [
  { to: '/', label: 'Panel' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/resources', label: 'Recursos' },
  { to: '/missing', label: 'Desaparecidos' },
  { to: '/volunteers', label: 'Voluntarios' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="BlazeAid Hub — inicio"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-blaze/15 text-blaze ring-1 ring-blaze/30">
            <Flame className="size-5" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">
            BlazeAid{' '}
            <span className="font-normal text-muted-foreground">Hub</span>
          </span>
        </Link>

        <nav
          className="ml-4 flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Principal"
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/' }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            Iniciar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
