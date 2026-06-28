import { Link } from '@tanstack/react-router'
import { ArrowLeft, Construction } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface RoutePlaceholderProps {
  title: string
  description: string
}

export function RoutePlaceholder({
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Construction className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>
      <Button variant="outline" asChild className="mt-8">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Volver al panel
        </Link>
      </Button>
    </section>
  )
}
