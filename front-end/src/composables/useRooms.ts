import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { STATE_ENUM } from '@/constants'
import type { Room } from '@/types'
import { useRoomsStore } from '@/stores/rooms'

export interface RoomApiResponse {
  rooms: Room[]
}

export interface SearchRoomParams {
  date: string
  time: string
  duration: number
  minCapacity: number | null
  equipments: string[]
}

export interface BookRoomParams {
  date: string
  time: string
  duration: number
}

const SNACKBAR_MESSAGE = {
  ERROR: {
    message: 'Une erreur est survenue, veuillez réessayer.',
    color: 'error',
  },
  BOOKING_SUCCESS: {
    message: 'Réservation réussie !',
    color: 'success',
  },
  BOOKING_FAILED: {
    message: 'Erreur lors de la réservation de la salle, veuillez réessayer.',
    color: 'error',
  },
}

export default function useRooms() {
  const roomsStore = useRoomsStore()
  const { roomList } = storeToRefs(roomsStore)

  const state = ref(STATE_ENUM.IDLE)
  const showSnackbar = ref(false)
  const snackbarMessage = ref({
    message: '',
    color: '',
  })

  const fetchAllRooms = async () => {
    state.value = STATE_ENUM.LOADING
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`)

      if (!response.ok) {
        state.value = STATE_ENUM.ERROR
        snackbarMessage.value = SNACKBAR_MESSAGE.ERROR
        showSnackbar.value = true
        throw new Error('Network response was not ok')
      }

      const jsonResponse: RoomApiResponse = await response.json()
      roomList.value = jsonResponse.rooms
      state.value = STATE_ENUM.SUCCESS
    } catch (error) {
      state.value = STATE_ENUM.ERROR
      snackbarMessage.value = SNACKBAR_MESSAGE.ERROR
      showSnackbar.value = true
      console.error('Error fetching rooms:', error)
    }
  }

  const searchRoom = async ({ date, time, duration, minCapacity, equipments }: SearchRoomParams) => {
    state.value = STATE_ENUM.LOADING
    try {
      const queryString = new URLSearchParams({
        date,
        time,
        duration: duration.toString(),
        minCapacity: minCapacity ? minCapacity.toString() : '',
        equipments: equipments.join(','),
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/search?${queryString}`)

      if (!response.ok) {
        state.value = STATE_ENUM.ERROR
        snackbarMessage.value = SNACKBAR_MESSAGE.ERROR
        showSnackbar.value = true
        console.error('Network response was not ok')
        return
      }

      const jsonResponse: RoomApiResponse = await response.json()
      roomList.value = jsonResponse.rooms
      state.value = STATE_ENUM.SUCCESS
    } catch (error) {
      state.value = STATE_ENUM.ERROR
      snackbarMessage.value = SNACKBAR_MESSAGE.ERROR
      showSnackbar.value = true
      console.error('Error fetching rooms:', error)
    }
  }

  const bookRoom = async (room: Room, params: BookRoomParams) => {
    state.value = STATE_ENUM.LOADING
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/book`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room,
          params
        })
      })

      if (!response.ok) {
        state.value = STATE_ENUM.ERROR
        const error = await response.json()

        if (error?.message) {
          snackbarMessage.value = {
            message: error.message,
            color: 'error'
          }
        } else {
          snackbarMessage.value = SNACKBAR_MESSAGE.BOOKING_FAILED
        }

        showSnackbar.value = true
        console.error('Error booking room:', error.message)
        return
      }

      const jsonResponse: RoomApiResponse = await response.json()
      roomList.value = jsonResponse.rooms
      state.value = STATE_ENUM.SUCCESS
      snackbarMessage.value = SNACKBAR_MESSAGE.BOOKING_SUCCESS
      showSnackbar.value = true
    } catch (error) {
      state.value = STATE_ENUM.ERROR
      snackbarMessage.value = SNACKBAR_MESSAGE.BOOKING_FAILED
      showSnackbar.value = true
      console.error('Error booking room:', error)
    }
  }

  return { roomList, state, showSnackbar, snackbarMessage, fetchAllRooms, searchRoom, bookRoom }
}
