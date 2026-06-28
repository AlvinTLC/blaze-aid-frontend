import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { HeartHandshake, SearchX } from 'lucide-react'

import { projectsQuery } from '@/api/queries'
import { CatalogPage } from '@/components/catalog/catalog-page'
import { ProjectCard } from '@/components/catalog/project-card'
import { PROJECT_CATEGORIES } from '@/lib/catalog'
import { PAGE_SIZE, catalogSearch, pageToOffset } from '@/lib/search'

export const Route = createFileRoute('/projects')({
  validateSearch: catalogSearch('category'),
  component: ProjectsPage,
})

function ProjectsPage() {
  const search = useSearch({ from: '/projects' })
  const navigate = useNavigate({ from: '/projects' })
  const page = search.page ?? 1

  const { data, isLoading, isError } = useQuery(
    projectsQuery({
      q: search.q,
      region: search.region,
      status: search.status,
      category: search.category,
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
      title="Proyectos de ayuda"
      description="Iniciativas de asistencia humanitaria en todo el país."
      icon={HeartHandshake}
      accentClass="text-blaze"
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
        key: 'category',
        label: 'Categoría',
        options: PROJECT_CATEGORIES,
        value: search.category,
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
      renderItem={(p) => <ProjectCard project={p} />}
      emptyIcon={SearchX}
    />
  )
}
