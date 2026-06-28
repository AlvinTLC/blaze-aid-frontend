import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Package, SearchX } from 'lucide-react'

import { resourcesQuery } from '@/api/queries'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { ResourceCard } from '@/components/catalog/resource-card'
import { RESOURCE_TYPES } from '@/lib/catalog'
import { PAGE_SIZE, catalogSearch, pageToOffset } from '@/lib/search'

export const Route = createFileRoute('/resources')({
  validateSearch: catalogSearch('type'),
  component: ResourcesPage,
})

function ResourcesPage() {
  const search = useSearch({ from: '/resources' })
  const navigate = useNavigate({ from: '/resources' })
  const page = search.page ?? 1

  const { data, isLoading, isError } = useQuery(
    resourcesQuery({
      q: search.q,
      region: search.region,
      status: search.status,
      type: search.type,
      from: search.from,
      to: search.to,
      limit: PAGE_SIZE,
      offset: pageToOffset(search.page),
    }),
  )

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <CatalogPage
      title="Recursos"
      description="Inventario de suministros y ayudas materiales disponibles."
      icon={Package}
      accentClass="text-blaze-gold"
      items={items}
      isLoading={isLoading}
      isError={isError}
      total={total}
      page={page}
      totalPages={totalPages}
      q={search.q}
      region={search.region}
      status={search.status}
      from={search.from}
      to={search.to}
      extraField={{
        key: 'type',
        label: 'Tipo',
        options: RESOURCE_TYPES,
        value: search.type,
      }}
      onFilterChange={(patch) =>
        navigate({
          search: (prev) => ({ ...prev, ...patch, page: undefined }),
          replace: true,
        })
      }
      onPageChange={(p) =>
        navigate({
          search: (prev) => ({ ...prev, page: p === 1 ? undefined : p }),
        })
      }
      onReset={() => navigate({ search: {}, replace: true })}
      renderItem={(r) => <ResourceCard resource={r} />}
      emptyIcon={SearchX}
    />
  )
}
