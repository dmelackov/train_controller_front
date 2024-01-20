<template>

  
  <div class="station_list">
    <div class="schedule_selector">
      <p>Source</p>
      <select v-model="source_station">
        <option disabled value="">Please select one</option>
        <option :value="item.uuid" v-for="item in stations" :key="item.uuid">{{ item.name }}</option>
      </select>
      <p>Destination</p>
      <select v-model="destionation_station">
        <option disabled value="">Please select one</option>
        <option :value="item.uuid" v-for="item in stations" :key="item.uuid">{{ item.name }}</option>
      </select>
      <label for="is_twoway">Is Twoway</label>
      <input v-model="is_twoway" type="checkbox" name="Twoway" id="is_twoway">
      <button @click="send">Send</button>
    </div>
    <hr>
    <template v-for="station in stations" v-bind:key="station.uuid">
      <StationCard :station_id="station.uuid"></StationCard>
    </template>
  </div>
</template>

<script setup>
import StationCard from './components/StationCard.vue';
import {api, websocket_api} from './api';
import { onMounted, ref } from 'vue';

const stations = ref([])

const source_station = ref("")
const destionation_station = ref("")
const is_twoway = ref(false)

function send() {
  if(source_station.value && destionation_station.value){
    api.set_station_schedule(source_station.value, destionation_station.value, is_twoway.value)
  }
}

onMounted(async () => {
  websocket_api.emitter.on("update_station_list", async () => {
    stations.value = await api.get_stations()
  })
  websocket_api.open()
  stations.value = await api.get_stations()
})


</script>

<style lang="scss">
.schedule_selector{
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
