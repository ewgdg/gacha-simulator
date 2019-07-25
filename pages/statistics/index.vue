<template>
  <div>
    <b-tabs
      v-model="tabIndex"
      content-class="mt-3"
      justified
      :active-nav-item-class="['bg-info', 'text-light', 'text-active']"
    >
      <b-tab title="Statistical Distribution" active>
        <RarityDistribution></RarityDistribution>
      </b-tab>
      <b-tab title="Company Revenue">
        <RevenueChart></RevenueChart>
      </b-tab>
      <b-tab title="Player Spending">
        <SpendingChart></SpendingChart>
      </b-tab>
      <b-tab title="Player Collection">
        <PlayerCollection></PlayerCollection>
      </b-tab>
      <b-tab title="Secret">
        <ProbabilityProfile></ProbabilityProfile>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import ProbabilityProfile from '~/components/statistics/ProbabilityProfile'
import RarityDistribution from '~/components/statistics/RarityDistribution'
import RevenueChart from '~/components/statistics/RevenueChart'
import SpendingChart from '~/components/statistics/SpendingChart'
import PlayerCollection from '~/components/statistics/PlayerCollection'
export default {
  name: 'Statistics',
  components: {
    RarityDistribution: RarityDistribution,
    RevenueChart: RevenueChart,
    ProbabilityProfile: ProbabilityProfile,
    SpendingChart: SpendingChart,
    PlayerCollection: PlayerCollection
  },
  data() {
    return {
      tabIndex: 0
    }
  },
  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-primary', 'text-light']
      } else {
        return ['bg-light', 'text-info']
      }
    }
  }
}
</script>

<style scoped></style>
