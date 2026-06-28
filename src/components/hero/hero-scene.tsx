import { useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 1400

export interface PointerState {
  x: number
  y: number
}

/** Builds a spherical shell of points (single draw call). */
function useParticlePositions(count: number): Float32Array {
  return useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.2 + Math.random() * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])
}

function Particles() {
  const positions = useParticlePositions(COUNT)
  const ref = useRef<THREE.Points>(null)

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    mesh.rotation.y += delta * 0.035
    mesh.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f54b1f"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

function WireGlobe() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.7, 2]} />
      <meshBasicMaterial color="#ffcf3f" wireframe transparent opacity={0.14} />
    </mesh>
  )
}

function Rig({
  pointer,
  children,
}: {
  pointer: RefObject<PointerState>
  children: React.ReactNode
}) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = group.current
    if (!g) return
    const { x, y } = pointer.current
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.35, 0.04)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.22, 0.04)
  })
  return <group ref={group}>{children}</group>
}

export function HeroScene({ pointer }: { pointer: RefObject<PointerState> }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <Rig pointer={pointer}>
        <WireGlobe />
        <Particles />
      </Rig>
    </Canvas>
  )
}
