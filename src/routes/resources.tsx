import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholder } from '@/components/route-placeholder'

export const Route = createFileRoute('/resources')({
  component: () => (
    <RoutePlaceholder
      title="Recursos"
      description="El inventario de recursos con filtros por tipo, región y disponibilidad estará disponible en la Fase 2."
    />
  ),
})
