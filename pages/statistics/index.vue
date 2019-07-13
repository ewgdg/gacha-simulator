<template>
  <div>
    <ProbabilityDistribution></ProbabilityDistribution>
  </div>
</template>

<script>
import ProbabilityDistribution from '~/components/statistics/ProbabilityDistribution'

export default {
  name: 'Index',
  components: {
    ProbabilityDistribution: ProbabilityDistribution
  }
}
</script>

<style scoped></style>
