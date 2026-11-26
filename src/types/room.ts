export type Room = {
  id: number
  name: string
  building: string
  floor: number
  availableSlots: number
  description: string
}

export type RoomPage = {
  items: Room[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type BookingStatus = 'ACTIVE' | 'CANCELLED'

export type Booking = {
  id: number
  resourceId: number
  resourceName: string
  attendees: number
  status: BookingStatus
}
