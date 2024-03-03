<template>

  <router-view></router-view>
  <!-- <Container>
    <Loader class="cards__loader" v-if="IsLoading" />
    <div class="cards__container" v-else>
      <StationCardv2 v-for="station in sorted_stations" :key="station.uuid" :station_uuid="station.uuid" />
    </div>
  </Container> -->
</template>

<script setup>
import { RouterView } from 'vue-router'
// import RouterView from 'vue-router'
// import StationCardv2 from './components/StationCardv2.vue';
// import Container from './components/Container.vue';
// import { useStationStore } from './store/stationStore'
// import { onMounted, computed, ref } from 'vue';
// import { websocket_api } from './api';
// import Loader from './components/Loader.vue';
import { websocket_api } from '@/app/api';
import { useStationStore } from '@/store/stationStore';
import { onMounted } from 'vue';



// const store = useStationStore()
// const IsLoading = ref(true);
// const sorted_stations = computed(() => {
//   return store.stations.slice().sort((a, b) => {
//     if (!a.info || !b.info) return 0
//     const hasTrainA = !!a.info.train_name || '';
//     const hasTrainB = !!b.info.train_name || '';
//     if (hasTrainA && !hasTrainB)
//       return -1
//     if (!hasTrainA && hasTrainB)
//       return 1
//     return 0
//   });
// });


// onMounted(async () => {
//   websocket_api.open();
//   await store.getStations()
//   IsLoading.value = false
// });
  onMounted(async () => {
    websocket_api.open()
    await useStationStore().getStations()
  })
  


</script>

<style lang="scss">
.cards__container {
  display: grid;
  gap: 20px;
}

@media (min-width: 1200px) {
  .cards__container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.cards__container .station-card-v2 {
  width: 400px;
}

/* 2 колонки на средних экранах */
@media (max-width: 1199px) and (min-width: 768px) {
  .cards__container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 1 колонка на маленьких экранах */
@media (max-width: 767px) {
  .cards__container {
    grid-template-columns: 1fr;
  }
}

.container {
  display: flex;
  justify-content: center;
}
</style>
