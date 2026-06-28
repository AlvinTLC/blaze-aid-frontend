/**
 * URL search-param helpers for the catalog routes.
 * Keeps filters shareable and back/forward-friendly via TanStack Router.
 */

export const PAGE_SIZE = 12

export interface CatalogSearch {
  q?: string
  region?: string
  status?: string
  page?: number
  from?: string
  to?: string
}

function asStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

function asPosInt(v: unknown): number | undefined {
  if (v == null || v === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : undefined
}

/**
 * Builds a `validateSearch` function for a route, typed with the
 * resource-specific extra filter (e.g. category / type / skill).
 * Pass a single literal key so the inferred type stays exact (no index
 * signature that would clash with `page: number`).
 */
export function catalogSearch<TExtra extends string>(extraKey: TExtra) {
  return (input: Record<string, unknown>): CatalogSearch &
    { [K in TExtra]?: string } => {
    const base: CatalogSearch = {
      q: asStr(input['q']),
      region: asStr(input['region']),
      status: asStr(input['status']),
      page: asPosInt(input['page']),
      from: asStr(input['from']),
      to: asStr(input['to']),
    }
    const extraVal = asStr(input[extraKey])
    return (extraVal
      ? { ...base, [extraKey]: extraVal }
      : { ...base }) as CatalogSearch & { [K in TExtra]?: string }
  }
}

/** Convert a 1-based page to the API offset. */
export function pageToOffset(page: number | undefined): number {
  const p = page && page >= 1 ? page : 1
  return (p - 1) * PAGE_SIZE
}
