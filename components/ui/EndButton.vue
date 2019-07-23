<template>
  <b-button v-if="$store.state.gameStatus" variant="danger" class="uiButton">
    <span @click="endGame()">
      End Game
    </span>
  </b-button>
</template>

<script>
export default {
  name: 'EndButton',
  methods: {
    endGame() {
      // console.log('clicked end game!')
      this.$store.dispatch('endGame')
      this.$router.push('/result')
      // sessionStorage.removeItem('vuex')
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
