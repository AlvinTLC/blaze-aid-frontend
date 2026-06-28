import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholder } from '@/components/route-placeholder'

export const Route = createFileRoute('/volunteers')({
  component: () => (
    <RoutePlaceholder
      title="Voluntarios"
      description="El directorio de voluntarios con filtros por habilidad y región estará disponible en la Fase 2."
    />
  ),
})
