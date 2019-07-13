<template>
  <div class="d-flex justify-content-around">
    <LineChart
      class="chart"
      :chart-data="chartData"
      :options="chartOptions"
    ></LineChart>
  </div>
</template>

<script>
import LineChart from '~/components/statistics/LineChart'

export default {
  name: 'RevenueChart',
  components: {
    LineChart: LineChart
  },
  computed: {
    chartData() {
      const raw_data = this.$store.state.modules.statistics.revenue
      const day = this.$store.state.modules.statistics.day

      const data = []
      const labels = []
      for (let i = 0; i <= day; i++) {
        let amount = 0
        if (raw_data[i]) {
          amount = raw_data[i]
        }
        data.push(amount)
        labels.push('day ' + i)
      }

      return {
        datasets: [
          {
            data: data,
            label: 'revenue per day',
            pointBackgroundColor: 'lightgreen',
            pointBorderColor: 'lightgreen',
            borderColor: 'lightgreen',
            backgroundColor: 'transparent',
            steppedLine: false,
            cubicInterpolationMode: 'default',
            lineTension: 0.4
          }
        ],
        labels: labels
      }
    },
    chartOptions() {
      return {
        title: {
          text: 'Company Revenue',
          display: true
        }
      }
    }
  }
}
</script>

<style scoped></style>
