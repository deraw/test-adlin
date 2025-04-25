<script setup lang="ts">
import { mdiCalendarFilter, mdiAccountGroup, mdiClockStart, mdiClockTimeFourOutline, mdiCalendarSearch } from '@mdi/js'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import type { EquipmentItem } from '@/types'

type DateModel = string | null
type TimeModel = string | null
type DurationModel = number | null
type MinCapacityModel = number | null
type EquipmentsModel = string[] | null

defineProps<{
  equipmentList: EquipmentItem[],
  loading?: boolean
}>()

const date = defineModel<DateModel>('date')
const time = defineModel<TimeModel>('time')
const duration = defineModel<DurationModel>('duration')
const minCapacity = defineModel<MinCapacityModel>('minCapacity')
const equipments = defineModel<EquipmentsModel>('equipments')

const emit = defineEmits([
  'search',
  'reset'
])

const form = ref()
const hasSubmitted = ref(false)

const timePickerMenu = ref(false)
const timeErrors = computed(() => {
  return hasSubmitted.value ? time.value ? [] : ['Heure requise'] : []
})

const datePickerMenu = ref(false)
const inputDate = computed({
  get: () => date.value ? dayjs(date.value).format('YYYY-MM-DD') : '',
  set: (newDate: Date) => {
    date.value = dayjs(newDate).format('YYYY-MM-DD')
  }
})
const dateErrors = computed(() => {
  return hasSubmitted.value ? date.value ? [] : ['Date requise'] : []
})

const durationOptions = [
  { title: '15 min', value: 15 },
  { title: '30 min', value: 30 },
  { title: '1 heure', value: 60 },
  { title: '1 heure 30 min', value: 90 },
  { title: '2 heures', value: 120 }
]
const durationRules = [
  (v: number) => Boolean(v) || 'Durée requise',
  (v: number) => {
    if (!v) return true
    return durationOptions.some(option => option.value === v) || 'Durée invalide'
  }
]

async function submit() {
  hasSubmitted.value = true
  const { valid } = await form.value.validate()
  if (!valid) return
  emit('search')
}

function reset() {
  hasSubmitted.value = false

  date.value = null
  time.value = null
  duration.value = null
  minCapacity.value = null
  equipments.value = []

  form.value.resetValidation()
  emit('reset')
}
</script>

<template>
  <VCard>
    <VForm
      ref="form"
      validate-on="input lazy"
      @submit.prevent="submit"
    >
      <VCardTitle tag="h1">
        Réserver une salle
      </VCardTitle>

      <VContainer>
        <VRow>
          <VCol
            lg="2"
            cols="12"
          >
            <VTextField
              v-model="inputDate"
              :active="datePickerMenu"
              :focus="datePickerMenu"
              :prepend-icon="mdiCalendarFilter"
              :errorMessages="dateErrors"
              label="Date"
              readonly
            >
              <VMenu
                v-model="datePickerMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <VDatePicker
                  v-if="datePickerMenu"
                  v-model="inputDate"
                  full-width
                />
              </VMenu>
            </VTextField>
          </VCol>

          <VCol
            lg="2"
            cols="12"
          >
            <VTextField
              v-model="time"
              :active="timePickerMenu"
              :focus="timePickerMenu"
              :prepend-icon="mdiClockTimeFourOutline"
              :errorMessages="timeErrors"
              label="Heure"
              readonly
            >
              <VMenu
                v-model="timePickerMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <VTimePicker
                  v-if="timePickerMenu"
                  v-model="time"
                  format="24hr"
                  full-width
                />
              </VMenu>
            </VTextField>
          </VCol>

          <VCol
            lg="2"
            cols="12"
          >
            <VSelect
              v-model="duration"
              :items="durationOptions"
              :prepend-icon="mdiClockStart"
              :rules="durationRules"
              label="Durée"
            />
          </VCol>

          <VCol
            lg="3"
            cols="12"
          >
            <VNumberInput
              v-model="minCapacity"
              :min="1"
              :max="30"
              :prepend-icon="mdiAccountGroup"
              label="Capacité minimale"
              control-variant="stacked"
              hide-details
            />
          </VCol>

          <VCol
            lg="3"
            cols="6"
          >
            <VRow class="my-auto">
              <VCheckbox
                v-for="(equipmentItem, index) in equipmentList"
                :key="index"
                v-model="equipments"
                :label="equipmentItem.name"
                :value="equipmentItem.id"
                hide-details
                class="mx-2"
              />
            </VRow>
          </VCol>

          <VSpacer />

          <VCol
            cols="12"
            class="d-flex justify-end"
          >
            <VBtn
              :disabled="loading"
              color="primary"
              variant="outlined"
              class="mr-2"
              @click="reset"
            >
              Réinitialiser
            </VBtn>

            <VBtn
              :loading="loading"
              color="primary"
              type="submit"
            >
              <VIcon
                :icon="mdiCalendarSearch"
                class="mr-1"
              />

              Rechercher
            </VBtn>
          </VCol>
        </VRow>
      </VContainer>
    </VForm>
  </VCard>
</template>
