<script>
import { Pie } from 'vue-chartjs'
export default {
  name: 'ProbabilityDistribution',
  extends: Pie,
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped></style>
