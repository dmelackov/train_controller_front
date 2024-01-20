<template>
    <div class="station_card">
        <p class="station_id">{{ station_id }}</p>
        <input type="text" class="station_name" v-model="station_info.station_name">
        <button class="save" @click="save">Save</button>
        <p>Present: </p>
        <div class="train_present checkmark_label" :class="{active: station_info.train_present}"></div>
        <p>Enroute: </p>
        <div class="train_enroute checkmark_label" :class="{active: station_info.train_enroute}"></div>
        <p class="train_name">Train: {{ station_info.train_name }}</p>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { api, websocket_api } from '../api';

const station_info = ref({
    station_name: "",
    train_enroute: false,
    train_present: false,
    train_name: ""
})


const props = defineProps({
    station_id: String
})

function save() {
  api.set_station_name(props.station_id, station_info.value.station_name)
}

async function update_info(){
    station_info.value = await api.get_station_info(props.station_id)
}

function update_info_event(event){
    console.log(event)
    if (event.uuid == props.station_id)
        update_info()
}

onMounted(async ()=> {
    console.log("Mount!")
    update_info()
    websocket_api.emitter.on("update_station", update_info_event)
})

</script>

<style lang="scss">
.checkmark_label {
    border-radius: 16px;
    width: 16px;
    height: 16px;
    background-color: red;
    margin-right: 10px;
    margin-left: 3px;
    &.active {
        background-color: green;
    }
}

.save {
    margin-left: 5px;
    margin-right: 10px;
}

.station_card {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.station_id {
    margin-right: 10px;
    font-size: 10px;
    width: 170px;
}

</style>