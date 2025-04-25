<script setup lang="ts">
import { mdiCalendar, mdiAccountGroup, mdiInformation, mdiCalendarPlus } from '@mdi/js'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import type { Booking, EquipmentItem, Room } from '@/types'

defineProps<{
  rooms: Room[],
  showBookButton?: boolean
}>()

defineEmits<{
  (e: 'book', room: Room): void
}>()

function formatEquipments(equipments: EquipmentItem[]) {
  if (!equipments.length) {
    return 'Aucun équipement disponible'
  }

  const numberOfEquipments = equipments.length

  if (numberOfEquipments === 1) {
    return `Équipement : ${equipments[0].name}`
  }

  return `Équipements : ${equipments.map(e => e.name).join(', ')}`
}

function isRoomCurrentlyBooked(room: Room) {
  return room.bookings.some(booking => {
    const start = dayjs(booking.start)
    const end = dayjs(booking.end)
    return dayjs().isBetween(start, end, null, '[]')
  })
}

function getCurrentBooking(room: Room) {
  return room.bookings.find(booking => {
    const start = dayjs(booking.start)
    const end = dayjs(booking.end)
    return dayjs().isBetween(start, end, null, '[]')
  })
}

function isBookingOnMultipleDays(booking?: Booking) {
  if (!booking) {
    return false
  }

  const start = dayjs(booking.start)
  const end = dayjs(booking.end)

  return !start.isSame(end, 'day')
}

function formatHour(hour: string) {
  return dayjs(hour).format('HH:mm')
}

function formatDate(date: string) {
  return dayjs(date).format('DD/MM/YYYY')
}
</script>

<template>
  <VCard
    v-for="room in rooms"
    :key="room.id"
    class="mb-4"
  >
    <VCardTitle>
      {{ room.name }}

      <VChip
        v-if="isRoomCurrentlyBooked(room) && getCurrentBooking(room)"
        color="red"
        class="ml-2"
      >
        <template v-if="isBookingOnMultipleDays(getCurrentBooking(room))">
          Occupée
        </template>

        <template v-else>
          Occupée jusqu'à {{ formatHour(getCurrentBooking(room)?.end || '') }}
        </template>
      </VChip>
    </VCardTitle>

    <VCardSubtitle>{{ room.description }}</VCardSubtitle>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
          tag="ul"
        >
          <VListItem
            tag="li"
            class="px-0"
          >
            <VIcon
              :icon="mdiAccountGroup"
              class="mr-1 mb-1"
            />

            Capacité : {{ room.capacity }}
          </VListItem>

          <VListItem
            tag="li"
            class="px-0"
          >
            <VIcon
              :icon="mdiInformation"
              class="mr-1 mb-1"
            />

            {{ formatEquipments(room.equipments) }}
          </VListItem>
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <template v-if="room.bookings.length">
            <p>Réservations :</p>

            <ul>
              <VListItem
                v-for="(booking, index) in room.bookings"
                :key="index"
                tag="li"
                class="pa-0"
              >
                <VIcon
                  :icon="mdiCalendar"
                  class="mr-1 mb-1"
                />

                <span v-if="isBookingOnMultipleDays(booking)">
                  Du <time :datetime="booking.start">{{ formatDate(booking.start) }}</time>
                  de <time :datetime="formatHour(booking.start)">{{ formatHour(booking.start) }}</time>
                  jusqu'au <time :datetime="booking.end">{{ formatDate(booking.end) }}</time>
                  à <time :datetime="formatHour(booking.end)">{{ formatHour(booking.end) }}</time>
                </span>

                <span v-else>
                  Le <time :datetime="booking.start">{{ formatDate(booking.start) }}</time>
                  de <time :datetime="formatHour(booking.start)">{{ formatHour(booking.start) }}</time>
                  à <time :datetime="formatHour(booking.end)">{{ formatHour(booking.end) }}</time>
                </span>
              </VListItem>
            </ul>
          </template>

          <template v-else>
            <p>Aucune réservation</p>
          </template>
        </VCol>
      </VRow>

      <VRow v-if="showBookButton">
        <VCol
          cols="12"
          class="d-flex justify-end"
        >
          <VBtn
            color="primary"
            @click="$emit('book', room)"
          >
            <VIcon
              :icon="mdiCalendarPlus"
              class="mr-1"
            />

            Réserver
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
