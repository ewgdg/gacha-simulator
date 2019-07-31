<template>
  <div v-if="blocking" class="p-0 m-0" style="height: 0">
    <LoadingSpinner></LoadingSpinner>
    <Blocker></Blocker>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/ui/LoadingSpinner'
import Blocker from '~/components/ui/Blocker'

export default {
  name: 'TerminateGame',
  components: {
    LoadingSpinner: LoadingSpinner,
    Blocker: Blocker
  },
  data() {
    return {
      blocking: false
    }
  },
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
      // this.$functions.useFunctionsEmulator('http://localhost:5001')
      // console.log('clicked end game!')
      this.blocking = true
      this.$store.dispatch('endGame')

      // sessionStorage.removeItem('vuex')
      return this.$uploadScore({
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
          this.blocking = false
          this.$router.push('/result')
        })
    }
  }
}
</script>
