<template>
  <router-view></router-view>
</template>

<script setup>
import { RouterView } from 'vue-router'

import { websocketApi } from '@/app/api'
import { useStationStore } from '@/app/store/stationStore'
import { onMounted } from 'vue'
onMounted(async () => {
  websocketApi.open()
  await useStationStore().getStations()
})
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
}

.cards {
  &__container {
    display: grid;
    gap: 20px;
  }
}
</style>
