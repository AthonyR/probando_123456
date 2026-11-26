import { useEffect, useState } from 'react'
import axios from 'axios'
import { api, errorMessage } from '../api'
import type { Booking } from '../types/room'
import BookingCard from '../components/BookingCard'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    api.get<Booking[]>('/me/bookings', { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setBookings(data) })
      .catch((err: unknown) => { if (!controller.signal.aborted) setError(errorMessage(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt])

  function reload() {
    setLoading(true)
    setError('')
    setAttempt((current) => current + 1)
  }

  async function cancel(booking: Booking) {
    if (cancelingId !== null) return
    if (!window.confirm(`¿Cancelar la reserva #${booking.id} de ${booking.resourceName}?`)) return
    setMessage('')
    setSuccess('')
    setCancelingId(booking.id)
    try {
      await api.patch<Booking>(`/bookings/${booking.id}/cancel`)
      setSuccess(`La reserva #${booking.id} fue cancelada.`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409 && err.response.data?.code === 'INVALID_STATE') {
        setMessage('La reserva cambió y ya no se puede cancelar. Se actualizó la lista.')
      } else setMessage(errorMessage(err))
    } finally {
      setCancelingId(null)
      reload()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis reservas</h1>
      {message && <p role="alert" className="text-red-700">{message}</p>}
      {success && <p role="status" className="text-green-800">{success}</p>}
      {loading && <p role="status">Cargando reservas…</p>}
      {error && (
        <div className="space-y-3">
          <p role="alert" className="text-red-700">{error}</p>
          <button className="button" onClick={reload}>Reintentar</button>
        </div>
      )}
      {!loading && !error && (
        bookings.length === 0 ? <p>Aún no tienes reservas.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking}>
                {booking.status === 'ACTIVE' && (
                  <button className="button" disabled={cancelingId !== null} onClick={() => cancel(booking)}>
                    {cancelingId === booking.id ? 'Cancelando…' : 'Cancelar reserva'}
                  </button>
                )}
              </BookingCard>
            ))}
          </div>
        )
      )}
    </div>
  )
}
