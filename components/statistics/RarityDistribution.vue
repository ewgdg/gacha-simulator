<template>
  <div class="d-flex justify-content-around">
    <PieChart
      v-if="display"
      :chart-data="chartData"
      :options="chartOptions"
      class="chart"
    ></PieChart>
    <p v-else style="display: block; height: 50vh; line-height: 50vh;">
      There is no data available right now.
    </p>
  </div>
</template>

<script>
import PieChart from '~/components/statistics/PieChart'

export default {
  name: 'ProbabilityDistribution',
  components: {
    PieChart: PieChart
  },
  props: {
    alive: {
      type: Boolean,
      default: false
    }
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
    display() {
      return this.$store.state.modules.statistics.total_count > 0
    },
    chartData() {
      if (this.alive) {
        this.$store.commit('modules/statistics/update_prob')
      }
      const raw_data = this.$store.state.modules.statistics.rarity_counter
      const prob = this.$store.state.modules.statistics.probabilities
      const data = []
      const labels = []
      const backgroundColor = []
      const list = Object.keys(raw_data)
      list.sort()
      for (const rarity of list) {
        labels.push('rarity' + rarity + `(${prob[rarity].toFixed(2)}%)`)
        data.push(raw_data[rarity])
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
          text: 'Current Rarity Distribution',
          display: true
        }
      }
    }
  }
}
</script>

<style scoped></style>
