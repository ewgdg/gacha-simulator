<template>
  <b-button variant="success">
    <span @click="startGame()">
      Start Game
    </span>
  </b-button>
</template>

<script>
export default {
  name: 'StartGameButton',
  methods: {
    startGame() {
      this.$store.dispatch('startGame')
    }
  }
}
</script>

<style scoped>
.uiButton {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
