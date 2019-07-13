<template>
  <div class="d-flex justify-content-around">
    <PieChart
      :chart-data="chartData"
      :options="chartOptions"
      style="width: 500px; height: 100%"
    ></PieChart>
  </div>
</template>

<script>
import PieChart from '~/components/statistics/PieChart'

export default {
  name: 'ProbabilityDistribution',
  components: {
    PieChart: PieChart
  },
  data() {
    return {
      colorMap: {
        6: 'orange',
        5: 'gold',
        4: 'rgb(179, 179, 255)',
        3: 'skyblue',
        2: 'rgb(230, 255, 153)',
        1: 'rgb(227, 225, 226)'
      }
    }
  },
  computed: {
    chartData() {
      const prob_dist = this.$store.state.modules.statistics.probabilities
      const data = []
      const labels = []
      const backgroundColor = []
      const list = Object.keys(prob_dist)
      list.sort()
      for (const rarity of list) {
        labels.push('rarity' + rarity)
        data.push(prob_dist[rarity])
        backgroundColor.push(this.colorMap[rarity])
      }
      return {
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColor
          }
        ],
        labels: labels
      }
    },
    chartOptions() {
      return {
        title: {
          text: 'Probability Distribution (%)',
          display: true
        }
      }
    }
  }
}
</script>

<style scoped></style>
