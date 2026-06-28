import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { CardGridSkeleton } from './card-grid-skeleton'
import { EmptyState } from './empty-state'
import { FilterBar, type FilterPatch } from './filter-bar'
import { Pagination } from './pagination'

interface CatalogPageProps<TItem> {
  title: string
  description: string
  icon: LucideIcon
  accentClass: string
  items: TItem[]
  isLoading: boolean
  isError: boolean
  total: number
  page: number
  totalPages: number
  q?: string
  region?: string
  status?: string
  from?: string
  to?: string
  extraField?: {
    key: string
    label: string
    options: readonly string[]
    value?: string
  }
  headerExtra?: ReactNode
  onFilterChange: (patch: FilterPatch) => void
  onPageChange: (page: number) => void
  onReset: () => void
  renderItem: (item: TItem) => ReactNode
  emptyIcon: LucideIcon
}

export function CatalogPage<TItem>({
  title,
  description,
  icon: Icon,
  accentClass,
  items,
  isLoading,
  isError,
  total,
  page,
  totalPages,
  q,
  region,
  status,
  from,
  to,
  extraField,
  headerExtra,
  onFilterChange,
  onPageChange,
  onReset,
  renderItem,
  emptyIcon,
}: CatalogPageProps<TItem>) {
  const isEmpty = !isLoading && !isError && items.length === 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-5">
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${accentClass}`} aria-hidden />
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <Badge variant="outline" className="ml-1 font-mono">
            {total}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <FilterBar
        q={q}
        region={region}
        status={status}
        from={from}
        to={to}
        extraField={extraField}
        onChange={onFilterChange}
        onReset={onReset}
      />

      {headerExtra ? <div className="mt-3">{headerExtra}</div> : null}

      <div className="mt-5">
        {isError ? (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            No pudimos cargar los resultados. Revisa tu conexión e intenta de nuevo.
          </div>
        ) : isLoading ? (
          <CardGridSkeleton />
        ) : isEmpty ? (
          <EmptyState
            icon={emptyIcon}
            title="Sin resultados"
            description="Prueba ajustar o limpiar los filtros para ver más registros."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => renderItem(item))}
            </div>
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                onPageChange={onPageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
