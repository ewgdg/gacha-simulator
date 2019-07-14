<template>
  <div class="d-flex justify-content-center align-items-center flex-column">
    <template v-if="!unlocked">
      <p class="text-center text-justify" style="line-height: 25vh">
        Pay $600 to a hacker to access your probability mass profile for a day.
      </p>
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
  computed: {
    unlocked() {
      return this.$store.state.modules.statistics.secretUnlocked
    }
  },
  methods: {
    unlock() {
      this.$store.commit('modules/statistics/unlockSecret')
    },
    getWeight(name) {
      const res = this.$store.state.modules.playerAgents.agents.player1
        .card_weights[name]
      return res
    }
  }
}
</script>

<style scoped></style>
