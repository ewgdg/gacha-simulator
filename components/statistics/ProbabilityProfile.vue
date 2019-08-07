<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <template v-if="!unlocked || blocking">
      <div style="height: 20vh" class="d-flex flex-row align-items-center">
        <p class="text-center">
          Pay $600 to access your probability mass profile for a day.
        </p>
      </div>
      <button class="btn btn-warning" @click="unlock()">Unlock</button>
    </template>
    <template v-else>
      <CardTable
        data-column-name="Probability Mass"
        :get-data="getWeight"
      ></CardTable>
    </template>
  </div>
</template>

<script>
import CardTable from '~/components/ui/CardTable'
export default {
  name: 'ProbabilityProfile',
  components: {
    CardTable: CardTable
  },
  data() {
    return {
      blocking: false
    }
  },
  computed: {
    unlocked() {
      return this.$store.state.modules.statistics.secretUnlocked
    }
  },
  methods: {
    async unlock() {
      this.blocking = true
      this.$eventBus.$emit('block')
      const amount = 600
      const player = await this.$playerAgentManager.getAgent('player1')
      await player.addTotalSpending(amount)
      this.$store.dispatch('modules/statistics/addPlayerSpending', amount)
      await this.loadWeights()
      this.$store.commit('modules/statistics/unlockSecret')
      this.$store.commit('persistGameState')
      this.$eventBus.$emit('unblock')
      // give some time for persisting state
      setTimeout(() => (this.blocking = false), 100)
    },
    async loadWeights() {
      const player = await this.$playerAgentManager.getAgent('player1')
      const card_weights = await player.getCardWeights()
      this.$store.commit('modules/playerAgents/mutate', {
        path: 'playerCardWeights',
        with: card_weights
      })
    },
    getWeight(name) {
      return this.$store.state.modules.playerAgents.playerCardWeights[name]
    }
  }
}
</script>

<style scoped></style>
