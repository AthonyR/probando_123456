import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errorMessage } from '../api'
import type { RoomPage } from '../types/room'
import RoomCard from '../components/RoomCard'
import Pagination from '../components/Pagination'

export default function RoomsPage() {
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<RoomPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    api.get<RoomPage>('/rooms', { params: { page, size: 5 }, signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setResult(data) })
      .catch((err: unknown) => { if (!controller.signal.aborted) setError(errorMessage(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [page, attempt])

  function changePage(next: number) {
    setLoading(true)
    setError('')
    setPage(next)
  }

  function retry() {
    setLoading(true)
    setError('')
    setAttempt(attempt + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Salas de estudio</h1>
      {loading && <p role="status">Cargando salas…</p>}
      {error && (
        <div className="space-y-3">
          <p role="alert" className="text-red-700">{error}</p>
          <button className="button" onClick={retry}>Reintentar</button>
        </div>
      )}
      {!loading && !error && result && (
        result.items.length === 0 ? <p>No hay salas para mostrar.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {result.items.map((room) => (
              <RoomCard key={room.id} room={room}>
                <Link to={`/rooms/${room.id}`} aria-label={`Ver detalle de ${room.name}`}>Ver detalle</Link>
              </RoomCard>
            ))}
          </div>
        )
      )}
      {result && !error && <Pagination page={page} totalPages={result.totalPages} loading={loading} onChange={changePage} />}
    </div>
  )
}
