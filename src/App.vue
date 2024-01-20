<template>
  <Container>
  

    <div class="cards__container">
      <StationCardv2 v-for="station in sorted_stations" :key="station.uuid" :station_uuid="station.uuid" />
    </div>

  </Container>
</template>

<script setup>

import StationCardv2 from './components/StationCardv2.vue';
import Container from './components/Container.vue';
import { useStationStore } from './store/stationStore'
import { onMounted, computed } from 'vue';
import { websocket_api } from './api';

const store = useStationStore()

const sorted_stations = computed(() => {
  return  store.stations.slice().sort((a, b) => {
        if(!a.info || !b.info) return 0
        const hasTrainA = !!a.info.train_name || '';
        const hasTrainB = !!b.info.train_name || '';
        if (hasTrainA && !hasTrainB)
          return -1
        if (!hasTrainA && hasTrainB)
          return 1
        return 0
    });
});


onMounted(async () => {
  websocket_api.open();
  await store.getStations()
});



</script>

<style lang="scss">
.cards__container {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 20px;
}
</style>
