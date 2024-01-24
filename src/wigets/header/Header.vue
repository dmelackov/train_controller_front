<template>
    <header class="header">
        <nav class="header__nav nav">
            <ul class="nav__menu">
               <li class="nav__list" v-for="link in links" :key="link.id">
                    <router-link :to="link.to">{{link.title}}</router-link>
               </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {ref} from 'vue'
const links = ref([
    {
        id:1,
        title: 'Trains',
        to:"/trains"
    },
    {
        id:1,
        title: 'Station',
        to:"/"
    }
])
</script>

<style lang="scss" scoped>
.header 
{
    background-color:white;
    padding: 20px;
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 100;
}
.nav 
{
    &__menu 
    {
        display: flex;
        gap: 20px;
        font-size: 20px;
    }
}
</style>