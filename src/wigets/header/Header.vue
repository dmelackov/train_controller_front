<template>
  <header class="header">
    <nav class="header__nav nav">
      <ul class="nav__menu">
        <li class="nav__list" v-for="link in NAV_LINKS" :key="link.id">
          <router-link class="link" :to="link.to">{{ link.title }}</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { NAV_LINKS } from '@/app/constants'
</script>

<style lang="scss" scoped>
.header {
  background-color: #292929;
  padding: 20px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
}

.nav {
  &__menu {
    display: flex;
    gap: 20px;
    font-size: 20px;

    .link {
      color: white;
    }
  }
}
</style>
