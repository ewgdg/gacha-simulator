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
  computed: {
    player() {
      if (this.$store.state.modules.playerAgents.agents.player1) {
        return this.$store.state.modules.playerAgents.agents.player1
      }
      return {}
    },
    playerRank() {
      return this.$store.state.modules.playerAgents.playerRank
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    endGame() {
      // this.$functions.useFunctionsEmulator('http://localhost:5001')
      // console.log('clicked end game!')
      this.$store.dispatch('endGame')

      // sessionStorage.removeItem('vuex')
      this.$uploadScore({
        username: this.user.displayName,
        uid: this.user.uid,
        score: this.player.score,
        localRank: this.playerRank
      })
        .then(() => {
          return this.$getGlobalRank()
        })
        .then((res) => {
          this.$store.commit('setGlobalRankTable', res)
          this.$router.push('/result')
        })
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
