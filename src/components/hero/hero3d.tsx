import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import type { PointerState } from './hero-scene'

const HeroScene = lazy(() =>
  import('./hero-scene').then((m) => ({ default: m.HeroScene })),
)

/**
 * Decides whether to mount the WebGL hero. Skips 3D when the user prefers
 * reduced motion or the device looks low-end; the CSS ambient backdrop
 * (always rendered behind it) remains as the fallback.
 */
function useEnable3D(): boolean {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCores = (navigator.hardwareConcurrency ?? 4) <= 2
    setEnabled(!reduce && !lowCores)
  }, [])
  return enabled
}

export function Hero3D() {
  const enabled = useEnable3D()
  const pointer = useRef<PointerState>({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="pointer-events-none absolute inset-0">
      <Suspense fallback={null}>
        <HeroScene pointer={pointer} />
      </Suspense>
    </div>
  )
}
