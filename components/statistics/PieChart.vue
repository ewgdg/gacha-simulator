<script>
import { Doughnut } from 'vue-chartjs'
export default {
  name: 'ProbabilityDistribution',
  extends: Doughnut,
  props: ['chartData', 'options'],
  mounted() {
    console.log(this)
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped></style>
