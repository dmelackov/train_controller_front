<template>
    <div class="station__container">
        <div class="station__wrap" v-for="station in sortedByStantion" :key="station" >
            <StationCard :station="station"/>
        </div>
    </div>
</template>

<script setup>
import StationCard from '@/features/stationCard/StationCard.vue';
import { useStationStore } from '@/store/stationStore';
import { computed } from 'vue';
const stationStore = useStationStore()

//Сортировка по станциям с поездами (чет не то надо переделать)
const sortedByStantion = computed(() => {
    return stationStore.stations.slice().sort((a, b) => {
        //if (!a.info || !b.info) return -1
        const hasTrainA = a.info?.train_present || a.info?.train_enroute;
        const hasTrainB = b.info?.train_present || b.info?.train_enroute;
        if (hasTrainA && !hasTrainB)
            return -1
        if (!hasTrainA && hasTrainB)
            return 1
        return 0
    });
});
// Коннект к сокету
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