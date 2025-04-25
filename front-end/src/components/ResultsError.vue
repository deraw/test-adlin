<script setup lang="ts">
import { mdiCalendarAlert } from '@mdi/js'
</script>

<template>
  <VCard>
    <VEmptyState
      :icon="mdiCalendarAlert"
      title="Une erreur est survenue."
      text="Veuillez réessayer plus tard ou en modifiant vos critères de recherche."
    />
  </VCard>
</template>
