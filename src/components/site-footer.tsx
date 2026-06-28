export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>
          <span className="font-medium text-foreground">BlazeAid Hub</span> —
          Plataforma abierta de ayuda humanitaria para Venezuela.
        </p>
        <p className="flex items-center gap-2">
          Hecho con propósito
          <span
            aria-hidden
            className="inline-flex gap-0.5 overflow-hidden rounded-[2px] text-[10px] leading-none ring-1 ring-border"
          >
            <span className="bg-blaze-gold px-1 py-1.5 text-transparent">.</span>
            <span className="bg-blaze-blue px-1 py-1.5 text-transparent">.</span>
            <span className="bg-destructive px-1 py-1.5 text-transparent">.</span>
          </span>
        </p>
      </div>
    </footer>
  )
}
