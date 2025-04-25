<script setup lang="ts">
import { mdiCalendarRemove } from '@mdi/js'
</script>

<template>
  <VCard>
    <VEmptyState
      :icon="mdiCalendarRemove"
      title="Pas de salle disponible."
      text="Recherchez une autre date ou un autre créneau horaire."
    />
  </VCard>
</template>
