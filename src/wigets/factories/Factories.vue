<template>
  <div class="factory__container">
    <div class="factory__wrap" v-for="factory_config in config?.factories" :key="factory_config.uuid">
      <FactoryCard :factory_config="factory_config" />
    </div>
  </div>
</template>

<script setup>
import { api } from '@/app/api.js'
import { onMounted, ref } from 'vue'
import FactoryCard from '@/features/factoryCard/FactoryCard.vue'
import { useFactoryStore } from '@/app/store/factoryStore'

let config = ref({})
let factoryStore = useFactoryStore()

onMounted(async () => {
  try {
    const cfg = await api.getConfig()
    config.value = cfg
    await factoryStore.getFactories()
  } catch (error) {
    console.error("Ошибка подгрузки конфига", error)
  }
})
</script>

<style lang="scss">
.factory {
  &__container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__wrap {
    width: 100%;
  }
}
</style>
