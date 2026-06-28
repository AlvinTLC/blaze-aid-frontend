import { useEffect, useMemo } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import {
  computeBounds,
  decimate,
  normalizeName,
  toPolygons,
  type GeoCollection,
} from '@/lib/geo'
import type { RegionTotal } from '@/lib/stats'

export interface MapItem {
  key: string
  name: string
  total: number
  ratio: number
}

interface BuiltState {
  key: string
  name: string
  total: number
  ratio: number
  color: THREE.Color
  geometries: THREE.ExtrudeGeometry[]
}

const BASE_COLOR = new THREE.Color('#20222b')
const BLAZE_COLOR = new THREE.Color('#f54b1f')
const GOLD_COLOR = new THREE.Color('#ffcf3f')

const MIN_DEPTH = 0.25
const MAX_DEPTH = 2.6

interface BuildResult {
  states: BuiltState[]
  centerLng: number
  centerLat: number
}

function buildStates(
  geo: GeoCollection,
  lookup: Map<string, RegionTotal>,
  maxTotal: number,
): BuildResult {
  const bounds = computeBounds(geo.features)
  const centerLng = bounds.minX + bounds.width / 2
  const centerLat = -(bounds.minY) - bounds.height / 2
  // Scale so the larger dimension maps to ~14 units
  const span = Math.max(bounds.width, bounds.height) || 1
  const scale = 14 / span

  const states: BuiltState[] = geo.features.map((feature) => {
    const name = feature.properties.shapeName
    const key = normalizeName(name)
    const total = lookup.get(key)?.total ?? 0
    const ratio = maxTotal > 0 ? total / maxTotal : 0

    const geometries = toPolygons(feature.geometry).map((polygon) => {
      const shape = new THREE.Shape()
      const outer = decimate(polygon[0] ?? [])
      outer.forEach((pt, i) => {
        const x = (pt[0] - centerLng) * scale
        const y = (pt[1] - centerLat) * scale
        if (i === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      })
      if (polygon.length > 1) {
        shape.holes = polygon.slice(1).map((ringRaw) => {
          const ring = decimate(ringRaw)
          const path = new THREE.Path()
          ring.forEach((pt, i) => {
            const x = (pt[0] - centerLng) * scale
            const y = (pt[1] - centerLat) * scale
            if (i === 0) path.moveTo(x, y)
            else path.lineTo(x, y)
          })
          return path
        })
      }
      const depth = MIN_DEPTH + ratio * MAX_DEPTH
      const g = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        steps: 1,
      })
      g.rotateX(-Math.PI / 2)
      g.computeVertexNormals()
      return g
    })

    const color = BASE_COLOR.clone().lerp(BLAZE_COLOR, 0.12 + ratio * 0.88)

    return { key, name, total, ratio, color, geometries }
  })

  return { states, centerLng, centerLat }
}

interface SceneProps {
  geo: GeoCollection
  regions: RegionTotal[]
  hoveredKey: string | null
  selectedKey: string | null
  onHover: (item: MapItem | null, clientX?: number, clientY?: number) => void
  onSelect: (item: MapItem | null) => void
}

function States({
  geo,
  regions,
  hoveredKey,
  selectedKey,
  onHover,
  onSelect,
}: SceneProps) {
  const lookup = useMemo(() => {
    const m = new Map<string, RegionTotal>()
    for (const r of regions) m.set(normalizeName(r.region), r)
    return m
  }, [regions])

  const maxTotal = useMemo(
    () => regions.reduce((m, r) => Math.max(m, r.total), 0),
    [regions],
  )

  const { states } = useMemo(
    () => buildStates(geo, lookup, maxTotal),
    [geo, lookup, maxTotal],
  )

  // Dispose all geometries on unmount (SPA leak guard)
  useEffect(() => {
    return () => {
      for (const s of states) for (const g of s.geometries) g.dispose()
    }
  }, [states])

  const toItem = (s: BuiltState): MapItem => ({
    key: s.key,
    name: s.name,
    total: s.total,
    ratio: s.ratio,
  })

  return (
    <group>
      {states.map((s) => {
        const isActive = s.key === hoveredKey || s.key === selectedKey
        return (
          <group key={s.key}>
            {s.geometries.map((geometry, i) => (
              <mesh
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                geometry={geometry}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation()
                  onHover(toItem(s), e.clientX, e.clientY)
                }}
                onPointerMove={(e: ThreeEvent<PointerEvent>) => {
                  onHover(toItem(s), e.clientX, e.clientY)
                }}
                onPointerOut={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation()
                  onHover(null)
                }}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation()
                  onSelect(toItem(s))
                }}
              >
                <meshStandardMaterial
                  color={s.color}
                  emissive={isActive ? GOLD_COLOR : '#000000'}
                  emissiveIntensity={isActive ? 0.5 : 0}
                  metalness={0.15}
                  roughness={0.65}
                  flatShading={false}
                />
              </mesh>
            ))}
          </group>
        )
      })}

      {/* subtle ground plane for depth grounding */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0c0d12" metalness={0} roughness={1} />
      </mesh>
    </group>
  )
}

interface MapHeroSceneProps {
  geo: GeoCollection
  regions: RegionTotal[]
  hoveredKey: string | null
  selectedKey: string | null
  onHover: (item: MapItem | null, clientX?: number, clientY?: number) => void
  onSelect: (item: MapItem | null) => void
}

export function MapHeroScene({
  geo,
  regions,
  hoveredKey,
  selectedKey,
  onHover,
  onSelect,
}: MapHeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 9, 16], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      onPointerMissed={() => onSelect(null)}
      style={{ width: '100%', height: '100%' }}
    >
      <hemisphereLight args={['#ffffff', '#101018', 0.8]} />
      <directionalLight position={[12, 22, 8]} intensity={1.5} />
      <directionalLight position={[-10, 12, -6]} intensity={0.4} color={'#88aaff'} />
      <States
        geo={geo}
        regions={regions}
        hoveredKey={hoveredKey}
        selectedKey={selectedKey}
        onHover={onHover}
        onSelect={onSelect}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableZoom
        minDistance={6}
        maxDistance={34}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
