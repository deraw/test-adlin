<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { mdiClose } from '@mdi/js'

import SearchCard from '@/components/SearchCard.vue'
import ResultsLoading from '@/components/ResultsLoading.vue'
import ResultsError from '@/components/ResultsError.vue'
import ResultsCard from '@/components/ResultsCard.vue'
import ResultsEmpty from '@/components/ResultsEmpty.vue'

import { STATE_ENUM } from '@/constants'
import type { SearchRoomParams } from '@/composables/useRooms'

import { useRoomsStore } from '@/stores/rooms'
import useRooms from '@/composables/useRooms'
import type { Nullable } from '@/types'

const { state, showSnackbar, snackbarMessage, fetchAllRooms, searchRoom, bookRoom } = useRooms()

const roomsStore = useRoomsStore()
const { roomList, equipmentList } = storeToRefs(roomsStore)

const isSearching = ref(false)
const searchParams = ref<Nullable<SearchRoomParams>>({
  date: null,
  time: null,
  duration: null,
  minCapacity: null,
  equipments: [],
})

onMounted(() => {
  const url = new URL(window.location.href)
  const date = url.searchParams.get('date')
  const time = url.searchParams.get('time')
  const duration = url.searchParams.get('duration')
  const minCapacity = url.searchParams.get('minCapacity')
  const equipments = url.searchParams.get('equipments')

  if (!date || !time || !duration) {
    fetchAllRooms()
    return
  }

  searchParams.value.date = date as string
  searchParams.value.time = time as string
  searchParams.value.duration = Number(duration)

  if (minCapacity) {
    searchParams.value.minCapacity = Number(minCapacity)
  }

  if (equipments) {
    searchParams.value.equipments = equipments.split(',')
  }

  if (date && time && duration) {
    search()
  }
})

function search() {
  isSearching.value = true
  const params = searchParams.value

  if (!params.date || !params.time || !params.duration) {
    return
  }

  const url = new URL(window.location.href)
  url.searchParams.set('date', params.date)
  url.searchParams.set('time', params.time)
  url.searchParams.set('duration', params.duration.toString())

  if (params.minCapacity) {
    url.searchParams.set('minCapacity', params.minCapacity.toString())
  } else {
    url.searchParams.delete('minCapacity')
  }

  if (params.equipments?.length) {
    url.searchParams.set('equipments', params.equipments.join(','))
  } else {
    url.searchParams.delete('equipments')
  }

  window.history.replaceState({}, '', url)

  searchRoom(params as SearchRoomParams)
}

function resetSearch() {
  isSearching.value = false

  const url = new URL(window.location.href)
  url.searchParams.delete('date')
  url.searchParams.delete('time')
  url.searchParams.delete('duration')
  url.searchParams.delete('minCapacity')
  url.searchParams.delete('equipments')

  window.history.replaceState({}, '', url)
}
</script>

<template>
  <VSheet
    max-width="1200"
    class="mx-auto"
  >
    <SearchCard
      v-model:date="searchParams.date"
      v-model:time="searchParams.time"
      v-model:duration="searchParams.duration"
      v-model:min-capacity="searchParams.minCapacity"
      v-model:equipments="searchParams.equipments"
      :loading="state === STATE_ENUM.LOADING"
      :equipment-list="equipmentList"
      class="mb-4 mb-sm-14"
      @search="search"
      @reset="resetSearch"
    />

    <ResultsLoading v-if="state === STATE_ENUM.LOADING" />

    <ResultsError v-else-if="state === STATE_ENUM.ERROR" />

    <ResultsEmpty v-else-if="!roomList?.length" />

    <ResultsCard
      v-else
      :rooms="roomList"
      :show-book-button="isSearching"
      @book="bookRoom($event, searchParams as SearchRoomParams)"
    />
  </VSheet>

  <VSnackbar
    v-model="showSnackbar"
    :color="snackbarMessage.color"
    location="top"
  >
    {{ snackbarMessage.message }}

    <template #actions>
      <VBtn
        :icon="true"
        color="white"
        density="compact"
        @click="showSnackbar = false"
      >
        <span class="d-sr-only">Fermer</span>

        <VIcon
          :icon="mdiClose"
          size="20"
        />
      </VBtn>
    </template>
  </VSnackbar>
</template>
