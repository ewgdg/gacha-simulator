<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center"
    style="height: 50vh"
  >
    <b-button variant="success" :disabled="currentNumber > 0">
      <span @click="startGame()">
        Start Game
      </span>
    </b-button>
    <b-progress
      :value="currentNumber"
      :max="maxNumber"
      show-progress
      animated
      :precision="1"
      class="w-75 m-2"
    ></b-progress>
  </div>
</template>

<script>
export default {
  name: 'StartGameButton',
  computed: {
    maxNumber() {
      return this.$store.state.maxProgressValue
    },
    currentNumber() {
      return this.$store.state.progress
    }
  },
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
