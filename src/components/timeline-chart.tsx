import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Stats } from '@/lib/stats'

const SERIES_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

const TOOLTIP_STYLE = {
  background: 'var(--color-card)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.5rem',
  color: 'var(--color-foreground)',
  fontSize: '0.75rem',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
} as const

interface TimelineChartProps {
  timeline: Stats['timeline'] | undefined | null
}

function shortDay(label: string): string {
  const d = new Date(label)
  if (Number.isNaN(d.getTime())) return label
  return new Intl.DateTimeFormat('es-VE', {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

export function TimelineChart({ timeline }: TimelineChartProps) {
  const labels = timeline?.labels ?? []
  const datasets = (timeline?.datasets ?? []).filter(
    (d): d is NonNullable<typeof d> => !!d && !!d.label,
  )

  if (labels.length === 0 || datasets.length === 0) {
    return (
      <div className="grid h-48 place-items-center text-sm text-muted-foreground">
        Sin datos de actividad reciente.
      </div>
    )
  }

  const data = labels.map((label, i) => {
    const row: Record<string, number | string> = { label: shortDay(label) }
    for (const ds of datasets) row[ds.label] = ds.data?.[i] ?? 0
    return row
  })

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ left: -12, right: 8, top: 8, bottom: 0 }}
        >
          <defs>
            {datasets.map((ds, i) => (
              <linearGradient
                key={ds.label}
                id={`timeline-grad-${i}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={SERIES_COLORS[i % SERIES_COLORS.length]}
                  stopOpacity={0.45}
                />
                <stop
                  offset="95%"
                  stopColor={SERIES_COLORS[i % SERIES_COLORS.length]}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
            opacity={0.35}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            dy={6}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: 'var(--color-muted-foreground)' }}
            itemStyle={{ color: 'var(--color-foreground)' }}
            cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
          />
          {datasets.map((ds, i) => (
            <Area
              key={ds.label}
              type="monotone"
              dataKey={ds.label}
              name={ds.label}
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth={2}
              fill={`url(#timeline-grad-${i})`}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
