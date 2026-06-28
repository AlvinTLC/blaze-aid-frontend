import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function DetailLayout({
  back,
  backLabel = 'Volver',
  title,
  badges,
  children,
}: {
  back: '/projects' | '/resources' | '/volunteers' | '/missing'
  backLabel?: string
  title: ReactNode
  badges?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link to={back}>
          <ArrowLeft className="size-4" aria-hidden />
          {backLabel}
        </Link>
      </Button>
      <div className="flex flex-wrap items-start gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {badges}
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  )
}

export function DetailField({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  if (value == null || value === '') return null
  return (
    <div className="grid grid-cols-3 gap-2 border-b pb-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2">{value}</dd>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
