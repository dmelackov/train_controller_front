<template>
  <div class="factory">
    <p class="factory__uuid" @click="copy(uuidCopy)">{{ factoryProps.factory_config.uuid }}</p>
    <div class="factory__info">
      <p class="factory__name">{{ factoryProps.factory_config.name }}</p>
      <p class="factory__status">- {{ factory_info ? 'Online' : 'Offline' }}</p>
    </div>
    <p class="factory__buffers">Buffers:</p>
    <hr />
    <div class="factory__buffer-list" v-if="factory_info">
      <BufferInventoryCard
        v-for="buf in factory_config.buffers"
        :key="buf"
        :inventory_name="buf"
        :factory_uuid="factory_config.uuid"
      />
    </div>
    <p class="factory__stations">Stations:</p>
    <hr />
    <div class="factory__station-list" v-if="factory_info">
      <StationInventoryCard
        v-for="buf in factory_config.tracks"
        :key="buf.station_uuid"
        :inventory_name="buf.train_inventory"
        :factory_uuid="factory_config.uuid"
        :station_uuid="buf.station_uuid"
      />
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import { computed, defineProps, ref } from 'vue'
import { useFactoryStore } from '@/app/store/factoryStore'
import BufferInventoryCard from '@/components/BufferInventoryCard.vue'
import StationInventoryCard from '@/components/StationInventoryCard.vue'

const factoryStore = useFactoryStore()

const factoryProps = defineProps({
  factory_config: Object
})
const uuidCopy = ref(factoryProps.factory_config.uuid)
const { copy } = useClipboard({ uuidCopy })
const factory_info = computed(() => {
  return factoryStore.factories.find((v) => v.uuid == factoryProps.factory_config?.uuid)
})
</script>

<style lang="scss" scoped>
.factory {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--black);
  border-radius: 10px;
  color: white;
  padding: 10px;

  &__info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  &__uuid {
    font-size: 12px;
    color: rgb(189, 189, 189);
    cursor: pointer;
  }

  &__name {
    font-size: 20px;
    color: rgb(255, 255, 255);
  }

  &__buffer_list {
    overflow-x: scroll;
  }

  &__station-list {
    overflow-x: scroll;
  }

  &__buffer-list {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  &__station-list {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
</style>
