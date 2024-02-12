<template>
    <div class="factory__container">
        <div class="factory__wrap" v-for="factory_config in config?.factories" :key="factory_config.uuid" >
            <FactoryCard :factory_config="factory_config"/>
        </div>
    </div>
</template>

<script setup>
import { api } from "@/app/api.js"
import { ref } from "vue";
import FactoryCard from '@/features/factoryCard/FactoryCard.vue';

let config = ref({})
api.get_config().then((cfg)=>{
    config.value = cfg
    console.log(cfg)
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