<template>
  <div class="container">
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Statistical Distribution" active>
        <RarityDistribution></RarityDistribution>
      </b-tab>
      <b-tab title="Company Revenue"><RevenueChart></RevenueChart></b-tab>
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

export default {
  name: 'statistics',
  components: {
    RarityDistribution: RarityDistribution,
    RevenueChart: RevenueChart,
    ProbabilityProfile: ProbabilityProfile
  }
}
</script>

<style scoped></style>
