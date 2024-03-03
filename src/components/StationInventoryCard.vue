<template>
    <div class="buffer">
        <div class="buffer__top">
            <div class="buffer__first_line">
                <p class="buffer__name">{{ station?.name }} -- {{ station?.info?.train_present ? station?.info?.train_name : "None" }}</p>
                <p class="buffer__upd" @click="factoryStore.update_inventory_info(bufferProps.factory_uuid, bufferProps.inventory_name)">Upd</p>
            </div>
            <hr>
            <div class="buffer__item" v-for="item in inventory?.items" :key="item.item_name">
                {{ item.item_name.split(":", 2)[1] }}
                {{ item.item_count }} / {{ item.max_stack * item.slots }}
            </div>
        </div>
        <p class="buffer__free">Free slots: {{ inventory?.max_slots - inventory?.used_slots }}</p>
    </div>
</template>

<script setup>

import { useStationStore } from '@/store/stationStore';
import { defineProps, computed } from 'vue';
import { useFactoryStore } from '@/store/factoryStore';

let factoryStore = useFactoryStore();

let inventory = computed(() => {
    return factoryStore.get_factory(bufferProps.factory_uuid)?.inventories[bufferProps.inventory_name]
})

const stationStore = useStationStore()
let station = computed(() => {
    return stationStore.stations.find((v) => v.uuid == bufferProps.station_uuid)
})

const bufferProps = defineProps({
    station_uuid: String,
    inventory_name: String,
    factory_uuid: String
})

</script>

<style lang="scss">
    .buffer {
        background-color: rgb(34, 34, 34);
        border-radius: 10px;
        padding: 10px;
        gap: 10px;
        display: flex;
        flex-direction: column;
        width: max-content;
        justify-content: space-between;
        &__top {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        &__first_line {
            gap: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        &__upd {
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>