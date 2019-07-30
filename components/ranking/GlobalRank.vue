<template>
  <div v-if="player">
    <p>Hello {{ player.name }}</p>
    <RankTable
      data-column-name="Score"
      :get-data="getScore"
      :agents-prop="agents"
    ></RankTable>
  </div>
  <div v-else>
    There is no data available.
  </div>
</template>

<script>
import RankTable from '~/components/ranking/RankTable'

export default {
  name: 'GlobalRank',
  components: {
    RankTable: RankTable
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
    }
  }
}
</script>

<style scoped></style>
