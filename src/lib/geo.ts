/**
 * Lightweight geo helpers for the Venezuela states choropleth.
 * No d3 dependency — an equirectangular projection fitted to the data's
 * bounding box is accurate enough for Venezuela (near the equator) and
 * keeps the bundle small.
 */

export interface GeoProperties {
  shapeName: string
  shapeISO?: string
  shapeID?: string
  shapeType?: string
  shapeGroup?: string
}

export interface GeoFeature {
  type: 'Feature'
  properties: GeoProperties
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoCollection {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

type Ring = number[][]
type Position = { x: number; y: number }

/** Strip diacritics + lowercase so API region names match GeoJSON labels. */
export function normalizeName(name: string | undefined | null): string {
  if (!name) return ''
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Project lng/lat into an SVG-friendly space where north is up.
 * Uses raw degrees; the SVG viewBox is derived from the data bbox so the
 * aspect ratio stays correct and no manual sizing is needed.
 */
export function project(lng: number, lat: number): Position {
  return { x: lng, y: -lat }
}

function ringToPath(ring: Ring): string {
  let d = ''
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i]
    const p = project(lng, lat)
    d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(4)} ${p.y.toFixed(4)} `
  }
  return d + 'Z'
}

/** Convert a Polygon/MultiPolygon geometry into a single SVG path `d`. */
export function geometryToPath(geometry: GeoFeature['geometry']): string {
  if (geometry.type === 'Polygon') {
    return (geometry.coordinates as Ring[])
      .map(ringToPath)
      .join(' ')
  }
  return (geometry.coordinates as Ring[][])
    .flatMap((polygon) => polygon.map(ringToPath))
    .join(' ')
}

export interface GeoBounds {
  minX: number
  minY: number
  width: number
  height: number
}

/** Compute the SVG viewBox bounds for a feature collection (in projected space). */
export function computeBounds(features: GeoFeature[]): GeoBounds {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  const visit = (lng: number, lat: number) => {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }

  for (const feature of features) {
    const { coordinates, type } = feature.geometry
    if (type === 'Polygon') {
      for (const ring of coordinates as Ring[]) {
        for (const [lng, lat] of ring) visit(lng, lat)
      }
    } else {
      for (const polygon of coordinates as Ring[][]) {
        for (const ring of polygon) {
          for (const [lng, lat] of ring) visit(lng, lat)
        }
      }
    }
  }

  return {
    minX: minLng,
    minY: -maxLat,
    width: maxLng - minLng,
    height: maxLat - minLat,
  }
}
