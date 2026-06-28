import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { SearchX, Users } from 'lucide-react'

import { volunteersQuery } from '@/api/queries'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { VolunteerCard } from '@/components/catalog/volunteer-card'
import { VOLUNTEER_SKILLS } from '@/lib/catalog'
import { PAGE_SIZE, catalogSearch, pageToOffset } from '@/lib/search'

export const Route = createFileRoute('/volunteers')({
  validateSearch: catalogSearch('skill'),
  component: VolunteersPage,
})

function VolunteersPage() {
  const search = useSearch({ from: '/volunteers' })
  const navigate = useNavigate({ from: '/volunteers' })
  const page = search.page ?? 1

  const { data, isLoading, isError } = useQuery(
    volunteersQuery({
      q: search.q,
      region: search.region,
      status: search.status,
      skill: search.skill,
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
      title="Voluntarios"
      description="Personas disponibles para ayudar, con sus habilidades."
      icon={Users}
      accentClass="text-blaze-blue"
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
        key: 'skill',
        label: 'Habilidad',
        options: VOLUNTEER_SKILLS,
        value: search.skill,
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
      renderItem={(v) => <VolunteerCard volunteer={v} />}
      emptyIcon={SearchX}
    />
  )
}
