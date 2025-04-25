import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Room, EquipmentItem } from '@/types'

export const useRoomsStore = defineStore('rooms', () => {
  const roomList = ref<Room[]>([])

  const equipmentList = computed(() => {
    const allEquipments = roomList.value.flatMap((room) => room.equipments)
    const uniqueEquipments = allEquipments.reduce((acc: EquipmentItem[], obj) => {
      if (!acc.some(item => item.id === obj.id)) {
          acc.push(obj);
      }
      return acc;
    }, []);

    return uniqueEquipments
  })

  return { roomList, equipmentList }
})
