<template>
  <div>
    <b-button
      v-if="$store.state.gameStatus"
      variant="danger"
      class="uiButton"
      @click="endGame()"
    >
      <span>
        End Game
      </span>
    </b-button>
    <!--    <LoadingSpinner v-if="blocking"></LoadingSpinner>-->
    <!--    <Blocker v-if="blocking"></Blocker>-->

    <!--    <TerminateGame ref="terminator"></TerminateGame>-->
  </div>
</template>

<script>
// import LoadingSpinner from './LoadingSpinner'
// import Blocker from './Blocker'
import TerminateGame from '~/components/gameStatus/TerminateGame'

export default {
  name: 'EndButton',
  components: {
    // LoadingSpinner: LoadingSpinner,
    // Blocker: Blocker
    TerminateGame
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
  methods: {
    endGame() {
      // this.$refs.terminator.endGame()
      this.$root.$emit('terminate')
      // // this.$functions.useFunctionsEmulator('http://localhost:5001')
      // // console.log('clicked end game!')
      // this.blocking = true
      // this.$store.dispatch('endGame')
      //
      // // sessionStorage.removeItem('vuex')
      // this.$uploadScore({
      //   username: this.user.displayName,
      //   uid: this.user.uid,
      //   score: this.player.score,
      //   localRank: this.playerRank
      // })
      //   .then(() => {
      //     return this.$getGlobalRank()
      //   })
      //   .then((res) => {
      //     this.$store.commit('setGlobalRankTable', res)
      //     this.blocking = false
      //     this.$router.push('/result')
      //   })
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
