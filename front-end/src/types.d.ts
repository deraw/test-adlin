export interface EquipmentItem {
  id: string
  name: string
}

export interface Booking {
  start: string
  end: string
}

export interface Room {
  id: string
  name: string
  description: string
  capacity: number
  equipments: EquipmentItem[]
  bookings: Booking[]
  createdAt: string
  updatedAt: string
}

export interface VForm {
  resetValidation: () => void
  validate: () => boolean
  reset: () => void
}

type Nullable<T> = { [K in keyof T]: T[K] | null };
