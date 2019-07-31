<template>
  <div v-if="player">
    <p>
      Hello {{ player.name }}, your score is {{ getScore(player).toFixed(2) }},
      your local rank is {{ playerRank }}, and your total spending is ${{
        player.totalSpending
      }}
    </p>
    <RankTable
      data-column-name="Score"
      :get-data="getScore"
      :is-pagination="true"
    ></RankTable>
  </div>
  <div v-else>
    There is no data available.
  </div>
</template>

<script>
import RankTable from '~/components/ranking/RankTable'

export default {
  name: 'LocalRank',
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
