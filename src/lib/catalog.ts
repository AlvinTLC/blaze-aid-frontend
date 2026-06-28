/** Venezuelan states + Federal Dependencies + Capital District. */
export const VENEZUELA_STATES: readonly string[] = [
  'Amazonas',
  'Anzoátegui',
  'Apure',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Delta Amacuro',
  'Dependencias Federales',
  'Distrito Capital',
  'Falcón',
  'Guárico',
  'La Guaira',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'Yaracuy',
  'Zulia',
]

/** Common enum values seen in seed data (non-exhaustive; datalist, not strict). */
export const STATUS_OPTIONS = [
  'active',
  'closed',
  'available',
  'depleted',
  'missing',
  'found',
] as const

export const PROJECT_CATEGORIES = [
  'food',
  'water',
  'shelter',
  'health',
  'connectivity',
  'social',
  'logistics',
  'rescue',
] as const

export const RESOURCE_TYPES = [
  'food',
  'water',
  'medicine',
  'blankets',
  'shelter',
  'connectivity',
  'fuel',
  'tools',
] as const

export const VOLUNTEER_SKILLS = [
  'medic',
  'nurse',
  'logistics',
  'driver',
  'engineer',
  'electrical',
  'telecom',
  'networking',
  'translator',
  'coordinator',
  'rescue',
] as const
