<template>
  <div class="d-flex justify-content-around">
    <BarChart
      class="chart"
      :chart-data="chartData"
      :options="chartOptions"
    ></BarChart>
  </div>
</template>

<script>
import BarChart from '~/components/statistics/BarChart'

export default {
  name: 'SpendingChart',
  components: {
    BarChart: BarChart
  },
  computed: {
    chartData() {
      const raw_data = this.$store.state.modules.statistics.playerSpending
      const day = this.$store.state.modules.statistics.day

      const data = []
      const labels = []
      for (let i = 1; i <= day; i++) {
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
            label: 'Spending per day',
            backgroundColor: 'rgba(255, 179, 179, 0.5)',
            borderColor: 'rgb(255, 77, 77)',
            borderWidth: '1px'
          }
        ],
        labels: labels
      }
    },
    chartOptions() {
      return {
        title: {
          text: 'Player Spending',
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped></style>
