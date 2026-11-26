type PaginationProps = {
  page: number
  totalPages: number
  loading: boolean
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, loading, onChange }: PaginationProps) {
  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center justify-center gap-4">
      <button className="button" disabled={loading || page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
      <span aria-live="polite">Página {totalPages === 0 ? 0 : page} de {totalPages}</span>
      <button className="button" disabled={loading || page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</button>
    </nav>
  )
}
