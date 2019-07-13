<template>
  <div>
    <RarityDistribution></RarityDistribution>
    <RevenueChart></RevenueChart>
  </div>
</template>

<script>
import RarityDistribution from '~/components/statistics/RarityDistribution'
import RevenueChart from '~/components/statistics/RevenueChart'

export default {
  name: 'Index',
  components: {
    RarityDistribution: RarityDistribution,
    RevenueChart: RevenueChart
  }
}
</script>

<style scoped></style>
