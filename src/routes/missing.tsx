import { createFileRoute } from '@tanstack/react-router'

import { RoutePlaceholder } from '@/components/route-placeholder'

export const Route = createFileRoute('/missing')({
  component: () => (
    <RoutePlaceholder
      title="Personas desaparecidas"
      description="La búsqueda de personas, con detección por proximidad (near-me) sobre el mapa, estará disponible en la Fase 2."
    />
  ),
})
