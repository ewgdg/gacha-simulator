<template>
  <div>
    Hello {{ player.name }}, your score is {{ getScore(player) }}, and your
    local rank is
    {{ playerRank }}
    <RankTable data-column-name="Score" :get-data="getScore"></RankTable>
  </div>
</template>

<script>
import RankTable from '~/components/evaluation/RankTable'

export default {
  name: 'LocalRank',
  components: {
    RankTable: RankTable
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
    }
  },
  methods: {
    getScore(agent) {
      if (!agent) {
        return 0
      }
      return agent.score
    }
  }
}
</script>

<style scoped></style>
