<template>
  <div class="block" @contextmenu.prevent></div>
</template>

<script>
export default {
  name: 'Blocker'
}
</script>

<style scoped>
.block {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 3;
  background-color: rgba(39, 39, 45, 0.4);
  opacity: 0.33;
  pointer-events: auto;
}
</style>
