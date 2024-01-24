<template>
    <div class="station__container">
        <div class="station__wrap" v-for="station in sortedByStantion" :key="station" >
            <StationCard :station="station" :sortedByStantion="sortedByStantion"/>
        </div>
    </div>
</template>

<script setup>
import StationCard from '@/features/stationCard/StationCard.vue';
import { useStationStore } from '@/store/stationStore';
import { websocket_api } from '@/app/api';
import { onMounted, computed } from 'vue';
const stationStore = useStationStore()

//Сортировка по станциям с поездами (чет не то надо переделать)
const sortedByStantion = computed(() => {
    return stationStore.stations.slice().sort((a, b) => {
        if (!a.info || !b.info) return 0
        const hasTrainA = !!a.info.train_name || '';
        const hasTrainB = !!b.info.train_name || '';
        if (hasTrainA && !hasTrainB)
            return -1
        if (!hasTrainA && hasTrainB)
            return 1
        return 0
    });
});
// Коннект к сокету 
onMounted(async () => {
    try {
        websocket_api.open()
        await stationStore.getStations()
    }
    catch (error) {
        console.error('Ошибка вебсокета', error)
    }
})
</script>

<style lang="scss" scoped>
.inventory {
    font-size: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;

    &__items {
        background-color: rgb(39, 39, 39);
        color: white;
        margin-top: -5px;
        padding: 10px;
    }

    &__btn {
        cursor: pointer;
        transition: 0.1s ease-in;
        border-radius: 6px;
        padding: 2px 10px;

        &:hover {

            svg {
                transition: 0.2s ease-in;
                fill: var(--orange) !important;

            }
        }

    }

    &__more {
        display: flex;
        justify-content: center;

    }

    &__container {

        padding-top: 5px;
        padding-right: 20px;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 10px;
        width: 100%;

    }

    &__item {
        font-size: 12px;
        width: fit-content;
        height: fit-content;
    }
}

button {
    background-color: transparent;
}

.train {
    width: fit-content;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__checkbox {
        display: flex;
        align-items: center;

        & label {
            font-size: 16px;
            user-select: none;
            margin: 0 8px 0 0;
        }

        & input {
            width: 16px;
            height: 16px;
        }
    }

    &__status {
        position: absolute;
        right: -10px;
        top: 0;
        z-index: 1;
        aspect-ratio: 1/1;
        width: 6px;
        background-color: var(--orange);
        border-radius: 100%;

    }

    &__name {
        display: flex;
        align-items: center;

        & svg {
            margin-left: 16px;
        }
    }

    &__info {
        position: relative;
        font-size: 20px;
    }
}

.station {
    display: flex;
    gap: 40px;
    position: relative;
    background-color: var(--black);
    border-radius: 10px;
    color: white;
    padding: 10px;

    &__select {
        padding: 6px;
        border-radius: 6px;
        background-color: rgb(58, 58, 58);
        color: white;
        border: none;
        font-family: "Montserrat", sans-serif;
    }

    &__container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        flex-grow: 1;
    }

    &__controls {
        gap: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;

    }

    &__save {
        position: absolute;
        right: 10px;
        top: 10px;

    }

    &__info {
        display: flex;
        flex-direction: column;
    }

    &__uuid {
        font-size: 12px;
        margin-bottom: 10px;
        color: rgb(189, 189, 189);
    }

    &__change {

        position: relative;
        width: fit-content;
        display: flex;
        align-items: center;

        & svg {
            position: absolute;
            right: 0;
            pointer-events: none;
            margin-right: 4px;
            z-index: 0;
        }

        & input {

            font-family: "Montserrat", sans-serif;
            border-radius: 6px;
            padding: 6px 20px 6px 6px;
            background-color: rgb(58, 58, 58);
            border: none;
            color: white;
        }

    }


}
</style>