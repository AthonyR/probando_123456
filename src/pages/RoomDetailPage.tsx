import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { api, errorMessage } from '../api'
import type { Booking, Room } from '../types/room'
import RoomCard from '../components/RoomCard'
import Field from '../components/Field'

export default function RoomDetailRoute() {
  const { id } = useParams()
  return <RoomDetailPage key={id} id={id || ''} />
}

function RoomDetailPage({ id }: { id: string }) {
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [attendees, setAttendees] = useState('')
  const [attendeesError, setAttendeesError] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const [sending, setSending] = useState(false)
  const pending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    api.get<Room>(`/rooms/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) setRoom(data) })
      .catch((err: unknown) => { if (!controller.signal.aborted) setLoadError(errorMessage(err)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [id, attempt])

  async function refreshRoom() {
    try {
      const { data } = await api.get<Room>(`/rooms/${encodeURIComponent(id)}`)
      setRoom(data)
    } catch (error) {
      setMessage((current) => current || errorMessage(error))
    }
  }

  function retry() {
    setLoading(true)
    setLoadError('')
    setAttempt(attempt + 1)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!room || pending.current) return
    const value = attendees.trim()
    const count = Number(value)
    setMessage('')
    setSuccess('')
    if (!/^\d+$/.test(value) || count < 1 || count > 6) {
      setAttendeesError('Indica un número entero de 1 a 6 asistentes.')
      return
    }
    setAttendeesError('')
    pending.current = true
    setSending(true)
    try {
      const { data } = await api.post<Booking>(`/rooms/${room.id}/bookings`, { attendees: count })
      setSuccess(`Reserva #${data.id} confirmada para ${data.attendees} ${data.attendees === 1 ? 'asistente' : 'asistentes'}.`)
      setAttendees('')
      await refreshRoom()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409 && error.response.data?.code === 'NO_SLOTS') {
        setMessage('La sala ya no tiene turnos disponibles.')
        await refreshRoom()
      } else setMessage(errorMessage(error))
    } finally {
      pending.current = false
      setSending(false)
    }
  }

  return (
    <div className="max-w-xl space-y-5">
      <Link to="/dashboard">Volver al dashboard</Link>
      <h1 className="text-2xl font-bold">Detalle de la sala</h1>
      {loading && <p role="status">Cargando sala…</p>}
      {loadError && (
        <div className="space-y-3">
          <p role="alert" className="text-red-700">{loadError}</p>
          <button className="button" onClick={retry}>Reintentar</button>
        </div>
      )}
      {!loading && !loadError && room && (
        <>
          <RoomCard room={room} showDescription />
          <form noValidate onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Reservar un turno</h2>
            <Field id="attendees" label="Número de asistentes" type="number" inputMode="numeric" min={1} max={6} step={1} required
              value={attendees} onChange={(e) => setAttendees(e.target.value)} error={attendeesError} disabled={sending} />
            {message && <p role="alert" className="text-red-700">{message}</p>}
            {success && <p role="status" className="text-green-800">{success}</p>}
            <button className="button" disabled={sending}>{sending ? 'Reservando…' : 'Reservar'}</button>
          </form>
        </>
      )}
    </div>
  )
}
