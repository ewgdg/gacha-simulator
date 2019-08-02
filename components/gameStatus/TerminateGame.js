export default {
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
  created() {
    this.$root.$on('terminate', this.endGame)
  },
  methods: {
    endGame() {
      //
      // this.$functions.useFunctionsEmulator('http://localhost:5001') //
      // console.log('clicked end game!')
      this.$store.dispatch('endGame')
      const record = {
        username: this.user.displayName,
        uid: this.user.uid,
        score: this.player.score,
        localRank: this.playerRank
      } // sessionStorage.removeItem('vuex') return
      this.$uploadScore(record)
        .then(() => {
          return this.$getGlobalRank()
        })
        .then((res) => {
          this.$store.commit('setGlobalRankTable', res)
          this.$router.push('/result')
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
