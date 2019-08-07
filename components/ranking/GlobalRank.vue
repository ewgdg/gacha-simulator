<template>
  <div>
    <RankTable
      data-column-name="Score"
      :get-data="getScore"
      :agents-prop="agents"
      table-id="globalRank"
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
    agents() {
      return this.$store.state.globalRankTable
    }
  },
  async mounted() {
    await this.$waitForNuxt
    if (this.agents.length === 0) {
      this.getRank()
      // user need to refresh it manually on demand by click refresh button at global rank component
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
        this.$store.commit('persistData')
        this.blocking = false
      })
    }
  }
}
</script>

<style scoped></style>
