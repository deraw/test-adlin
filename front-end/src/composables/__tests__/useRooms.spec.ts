import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import useRooms from '../useRooms'
import { STATE_ENUM } from '@/constants'

describe('useRooms', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch all rooms successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ rooms: [] }),
      })
    ) as unknown as typeof fetch

    const { fetchAllRooms, state } = useRooms()

    await fetchAllRooms()

    expect(state.value).toBe(STATE_ENUM.SUCCESS)
    expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/rooms`)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should handle error when fetching all rooms', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as unknown as typeof fetch

    const { fetchAllRooms, state } = useRooms()

    await fetchAllRooms()

    expect(state.value).toBe(STATE_ENUM.ERROR)
    expect(global.fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_URL}/rooms`)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should search for rooms successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ rooms: [] }),
      })
    ) as unknown as typeof fetch

    const { searchRoom, state } = useRooms()

    const params = {
      date: '2023-10-01',
      time: '10:00',
      duration: 2,
      minCapacity: 10,
      equipments: ['projector'],
    }

    await searchRoom(params)

    expect(state.value).toBe(STATE_ENUM.SUCCESS)
    expect(global.fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/rooms/search?date=2023-10-01&time=10%3A00&duration=2&minCapacity=10&equipments=projector`
    )
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should handle error when searching for rooms', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as unknown as typeof fetch

    const { searchRoom, state } = useRooms()

    const params = {
      date: '2023-10-01',
      time: '10:00',
      duration: 2,
      minCapacity: 10,
      equipments: ['projector'],
    }

    await searchRoom(params)

    expect(state.value).toBe(STATE_ENUM.ERROR)
    expect(global.fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/rooms/search?date=2023-10-01&time=10%3A00&duration=2&minCapacity=10&equipments=projector`
    )
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  afterEach(() => {
    // Restore the original fetch function
    global.fetch = vi.fn()
  })
})
