import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { VENEZUELA_STATES, STATUS_OPTIONS } from '@/lib/catalog'

export type FilterPatch = Record<string, string | undefined>

interface FilterBarProps {
  q?: string
  region?: string
  status?: string
  from?: string
  to?: string
  /** Resource-specific filter (category / type / skill). */
  extraField?: {
    key: string
    label: string
    options: readonly string[]
    value?: string
  }
  onChange: (patch: FilterPatch) => void
  onReset: () => void
}

/** Text input that commits to the URL on a short debounce. */
function DebouncedText({
  value,
  placeholder,
  onChange,
}: {
  value: string | undefined
  placeholder: string
  onChange: (v: string | undefined) => void
}) {
  const [local, setLocal] = useState(value ?? '')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocal(value ?? '')
  }, [value])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const next = local.trim()
      onChange(next.length ? next : undefined)
    }, 300)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [local, onChange])

  return (
    <Input
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
    />
  )
}

function DatalistInput({
  id,
  value,
  placeholder,
  options,
  onChange,
}: {
  id: string
  value: string | undefined
  placeholder: string
  options: readonly string[]
  onChange: (v: string | undefined) => void
}) {
  return (
    <>
      <Input
        list={id}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value.trim() || undefined)
        }
      />
      <datalist id={id}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  )
}

export function FilterBar({
  q,
  region,
  status,
  from,
  to,
  extraField,
  onChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/50 p-3 sm:p-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <DebouncedText
          value={q}
          placeholder="Buscar..."
          onChange={(v) => onChange({ q: v })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <DatalistInput
          id="filter-region"
          value={region}
          placeholder="Estado"
          options={VENEZUELA_STATES}
          onChange={(v) => onChange({ region: v })}
        />
        <DatalistInput
          id="filter-status"
          value={status}
          placeholder="Estado (status)"
          options={STATUS_OPTIONS}
          onChange={(v) => onChange({ status: v })}
        />
        {extraField ? (
          <DatalistInput
            id={`filter-${extraField.key}`}
            value={extraField.value}
            placeholder={extraField.label}
            options={extraField.options}
            onChange={(v) => onChange({ [extraField.key]: v })}
          />
        ) : null}
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1">
          <Input
            type="date"
            value={from ?? ''}
            aria-label="Desde"
            onChange={(e) =>
              onChange({ from: e.target.value || undefined })
            }
          />
          <Input
            type="date"
            value={to ?? ''}
            aria-label="Hasta"
            onChange={(e) => onChange({ to: e.target.value || undefined })}
          />
        </div>
      </div>

      <div>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="size-3.5" />
          Limpiar filtros
        </Button>
      </div>
    </div>
  )
}
