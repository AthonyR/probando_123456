import type { ReactNode } from 'react'
import type { Booking } from '../types/room'

type BookingCardProps = {
  booking: Booking
  children?: ReactNode
}

const statusText: Record<string, string> = {
  ACTIVE: 'Activa',
  CANCELLED: 'Cancelada',
}

export default function BookingCard({ booking, children }: BookingCardProps) {
  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Reserva #{booking.id}</h2>
      <p>Sala: {booking.resourceName}</p>
      <p>Asistentes: {booking.attendees}</p>
      <p>
        Estado:{' '}
        <span className={booking.status === 'ACTIVE' ? 'font-medium text-green-800' : 'font-medium text-slate-600'}>
          {statusText[booking.status] ?? booking.status}
        </span>
      </p>
      {children}
    </article>
  )
}
