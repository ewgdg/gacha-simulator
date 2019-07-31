<template>
  <div>
    <RankTable
      data-column-name="Score"
      :get-data="getScore"
      :agents-prop="agents"
    ></RankTable>
    <div class="d-flex w-100">
      <button class="ml-auto btn btn-primary" @click="getRank">Refresh</button>
    </div>
    <LoadingSpinner v-if="blocking"></LoadingSpinner>
    <Blocker v-if="blocking"></Blocker>
  </div>
</template>

<script>
import LoadingSpinner from '~/components/ui/LoadingSpinner'
import Blocker from '~/components/ui/Blocker'
import RankTable from '~/components/ranking/RankTable'
export default {
  name: 'GlobalRank',
  components: {
    RankTable: RankTable,
    Blocker,
    LoadingSpinner
  },
  data() {
    return {
      blocking: false
    }
  },
  computed: {
    player() {
      // if (this.$store.state.modules.playerAgents.agents.player1) {
      //   return this.$store.state.modules.playerAgents.agents.player1
      // }
      return this.$store.state.modules.playerAgents.agents.player1
    },
    playerRank() {
      return this.$store.state.modules.playerAgents.playerRank
    },
    agents() {
      return this.$store.state.globalRankTable
    }
  },
  methods: {
    getScore(agent) {
      if (!agent) {
        return 0
      }
      return parseFloat(agent.score)
    },
    getRank() {
      this.blocking = true
      return this.$getGlobalRank().then((res) => {
        this.$store.commit('setGlobalRankTable', res)
        this.blocking = false
      })
    }
  }
}
</script>

<style scoped></style>
