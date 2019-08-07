export default {
  computed: {
    player() {
      return this.$store.state.modules.playerAgents.agents.player1
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
    async endGame() {
      //
      // this.$functions.useFunctionsEmulator('http://localhost:5001') //
      // console.log('clicked end game!')
      await this.$store.dispatch('endGame')
      const record = {
        username: this.user.displayName,
        uid: this.user.uid,
        score: this.player.score,
        localRank: this.playerRank
      } // sessionStorage.removeItem('vuex') return

      if (this.$store.state.difficulty === 'easy') {
        this.$router.push('/result')
        return
      }
      this.$eventBus.$emit('block')
      await this.$uploadScore(record)
        .then((break_record) => {
          if (break_record) {
            return this.$getGlobalRank()
          } else {
            return null
          }
        })
        .then((res) => {
          if (res) {
            this.$store.commit('setGlobalRankTable', res)
          }
          this.$router.push('/result')
        })
        .catch((e) => {
          console.log(e)
        })
      this.$eventBus.$emit('unblock')
    }
  }
}
