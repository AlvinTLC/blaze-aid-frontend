import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholder } from '@/components/route-placeholder'

export const Route = createFileRoute('/projects')({
  component: () => (
    <RoutePlaceholder
      title="Proyectos de ayuda"
      description="El catálogo de proyectos con filtros por categoría, región y estado estará disponible en la Fase 2."
    />
  ),
})
