import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

import { formatNumber } from '@/lib/format'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
}

/** Counts up from 0 to `value` with an ease-out curve on mount/value change. */
export function AnimatedCounter({
  value,
  duration = 1.4,
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(0)
  const text = useTransform(count, (v) => formatNumber(Math.round(v)))

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [count, value, duration])

  return (
    <motion.span className={className} aria-label={formatNumber(value)}>
      {text}
    </motion.span>
  )
}
