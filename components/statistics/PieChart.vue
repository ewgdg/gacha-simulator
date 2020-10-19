<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
  name: 'ProbabilityDistribution',
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    // The options object is not currently implemented reactively.
    options(to, from) {
      this.$data._chart.titleBlock.options.text = to.title.text
      // this.$data._chart.update()
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style scoped></style>
