<template>
  <div class="station__container">
    <div class="station__wrap" v-for="station in sortedByStantion" :key="station">
      <StationCard :station="station" />
    </div>
  </div>
</template>

<script setup>
import StationCard from '@/features/stationCard/StationCard.vue'
import { useStationStore } from '@/app/store/stationStore'
import { computed, watchEffect } from 'vue'
const stationStore = useStationStore()

const sortedByStantion = computed(() => {
  return stationStore.stations.toSorted((a, b) => {
    const hasTrainA = a.info?.train_present || a.info?.train_enroute
    const hasTrainB = b.info?.train_present || b.info?.train_enroute
    return hasTrainB - hasTrainA
  })
})
watchEffect(() => sortedByStantion)
</script>

<style lang="scss" scoped>
.station {
  &__container {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-grow: 1;
  }
}
</style>
