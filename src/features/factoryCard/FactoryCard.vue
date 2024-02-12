<template>
    <div class="factory">
        <p class="factory__uuid">{{ factoryProps.factory_config.uuid }}</p>
        <p class="factory__name">{{ factoryProps.factory_config.name }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const factoryProps = defineProps({
    factory_config: Object
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

    &__uuid {
        font-size: 12px;
        color: rgb(189, 189, 189);
        cursor: pointer;
    }
    &__name {
        font-size: 20px;
        color: rgb(255, 255, 255);
    }
}
</style>