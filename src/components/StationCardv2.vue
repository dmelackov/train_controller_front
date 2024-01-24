<template>
    <div class="station">
        <button class="station__save" @click="saveStation">
            <saveIcon />
        </button>
        <dl class="station__info">
            <dd class="station__uuid">{{ station_uuid }}</dd>
            <div class="station__change">

                <input type="text" v-model="stationInfo.station_name" />
                <changeIcon class="station__pen" />
            </div>
            <div class="station__train" v-if="stationInfo.train_present">
                <dd class="station__train-name">{{ stationInfo.train_name }}
                    <trainIcon />
                </dd>
                <div :class="1"></div>
            </div>
        </dl>

        <div class="station__train-info-controls" v-if="stationInfo.train_present">
            <select class="station__select" v-model="destination_uuid">
                <option disabled>Select value</option>
                <option v-for="station in route_stations" :key="station.uuid" :value="station.uuid">{{ station.name }}
                </option>
            </select>
            <div class="station__controls">
            <button class="station__go" @click="goButton">Go!</button>
               <div class="station__checkBox">
                <label for="twoWay">Туда сюда?</label>
                <input type="checkbox" id="twoWay" v-model="twoway">
               </div>
                
            </div>
        </div>
        <div v-else class="station__train-wait">
            Поезд занят!
        </div>
    </div>
</template>

<script setup>
import { defineProps, computed, ref } from "vue";
import { useStationStore } from "../store/stationStore";
import { api } from "../api";
import saveIcon from "../assets/saveIcon.vue";
import changeIcon from '../assets/changeIcon.vue'
import trainIcon from "../assets/trainIcon.vue";
const props = defineProps({
    station_uuid: String,
});

const twoway = ref(false);
const destination_uuid = ref("");

const store = useStationStore();

const route_stations = computed(()=> {
    return store.stations.slice().filter((station)=>{
        if (!station.info)
            return false
        if (station.uuid == props.station_uuid)
            return false
        if (station.info.train_present)
            return false
        if (station.info.train_enroute)
            return false
        return true
    })
})

const stationInfo = computed(() => {
    const station = store.stations.find((st) => st.uuid === props.station_uuid);
    if (!station || !station.info) return {
        train_present: false
    };
    return station.info;
});


const goButton = async () => {
    if (destination_uuid.value)
        await api.set_station_schedule(props.station_uuid, destination_uuid.value, twoway.value)
}

const saveStation = async () => {
    try {
        await api.set_station_name(
            props.station_uuid,
            stationInfo.value.station_name
        );
        console.log("Station name saved successfully");
    } catch (error) {
        console.error("Error saving station name:", error);
    }
};
</script>

<style lang="scss" scoped>
.station {
    background-color: rgb(29, 29, 29);;
    min-width: 380px;
    padding: 20px 20px;
    border-radius: 6px;
    position: relative;
 
    &__controls 
    {
        display: flex;
        align-items:center;
        justify-content: space-between;
        gap: 10px;
        
    }
    &__train-name {
        display: flex;
        align-items: center;

        & svg {
            margin-left: 5px;
        }
    }
    &__go 
    {
        font-family: "Montserrat", sans-serif;
        padding: 10px 20px;
        border:none;
        border-radius:6px;
        color:white;
        background-color: var(--orange);
        transition: 0.2s ease-in-out;
        max-width: 100px;
        &:hover 
        {
            background-color: var(--dark-orange);
        }
        &:active
        {
            background-color: black;
        }
    }
    &__train {
        margin-bottom: 10px;
    }

    &__save {
        & svg {
            height: 24px;
     
        }

        position: absolute;
        top: 10px;
        right: 10px;
        border:none;
        border-radius:6px;
        padding: 2px;
        aspect-ratio: 1/1;
        background-color: transparent;
     
        transition: 0.2s ease-in-out;
        cursor: pointer;
        z-index: 10;

        &:hover {
            background-color: var(--orange);
           
        }

        &:active {
            background-color: black;
          
        }
    }

    &__uuid {
        margin-bottom: 4px;
        font-size: 12px;
        color: var(--gray);
    }

    &__select {
        background-color:transparent;
        padding: 5px;
        color:white;
        border-radius:4px;
        border: 1px solid gray;
        display: block;
        width: 100%;
        margin-bottom: 10px;
        option 
        {
            background-color: rgb(43, 43, 43);
           
        }
    }
    &__checkBox 
    {
       
        display: flex;
        gap: 6px;
    }
    &__change {
        display: flex;
        width: fit-content;
        position: relative;
        max-width: 240px;
        & input {

          width: 100%;
            border: none;
            font-size: 24px;
            background-color:transparent;
            color:white;
        }

        margin-bottom: 2px;
    }

    &__pen {
        position: absolute;
        right: 0;
        pointer-events: none;
        transform: translate(-50%,50%);
    }
}</style>
