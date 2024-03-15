<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>
<style scoped lang="scss">
.btn {
  background-color: var(--orange);

  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  transition: 0.2s ease-in-out;

  &:hover {
    background-color: var(--dark-orange);
  }

  &:active {
    background-color: var(--gray);
  }
}
</style>
