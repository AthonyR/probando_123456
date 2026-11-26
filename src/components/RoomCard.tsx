import type { ReactNode } from 'react'
import type { Room } from '../types/room'

type RoomCardProps = {
  room: Room
  showDescription?: boolean
  children?: ReactNode
}

export default function RoomCard({ room, showDescription = false, children }: RoomCardProps) {
  return (
    <article className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{room.name}</h2>
      {showDescription && <p className="text-slate-700">{room.description}</p>}
      <p>Edificio: {room.building}</p>
      <p>Piso: {room.floor}</p>
      <p>Turnos disponibles: {room.availableSlots}</p>
      {children}
    </article>
  )
}
