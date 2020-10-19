<template>
  <b-container>
    <!--  div class="d-flex justify-content-around"> -->
    <b-row v-if="display_chart1 || display_chart2">
      <b-col v-if="display_chart1" lg="6">
        <div style="overflow:auto;">
          <PieChart
            :chart-data="chartData_all"
            :options="chartOptions_all"
            class="chart"
          ></PieChart>
        </div>
        <div style="overflow:auto;">
          <GoodnessOfFitTest :data="table_data_all"></GoodnessOfFitTest>
        </div>
      </b-col>
      <b-col v-if="display_chart2" lg="6">
        <div style="overflow:auto">
          <PieChart
            :chart-data="chartData_player"
            :options="chartOptions_player"
            class="chart"
          ></PieChart>
        </div>
        <div style="overflow:auto;">
          <GoodnessOfFitTest :data="table_data_player"></GoodnessOfFitTest>
        </div>
      </b-col>
    </b-row>
    <p v-else style="display: block; height: 50vh; line-height: 50vh;">
      There is no data available right now.
    </p>
  </b-container>
</template>

<script>
import GoodnessOfFitTest from '~/components/statistics/GoodnessOfFitTest'
import PieChart from '~/components/statistics/PieChart'
export default {
  name: 'ProbabilityDistribution',
  components: {
    PieChart: PieChart,
    GoodnessOfFitTest: GoodnessOfFitTest
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
    display_chart1() {
      return this.$store.state.modules.statistics.total_count > 0
    },
    display_chart2() {
      return this.playerData.total_count > 0
    },
    playerData() {
      return {
        raw_data: this.$store.getters[
          'modules/playerAgents/getPlayerRarityCounter'
        ],
        proportion: this.$store.getters[
          'modules/playerAgents/getPlayerRarityProportion'
        ],
        total_count: this.$store.getters[
          'modules/playerAgents/getPlayerTotalCardCount'
        ]
      }
    },
    allData() {
      return {
        raw_data: this.$store.state.modules.statistics.rarity_counter,
        proportion: this.$store.state.modules.statistics.probabilities,
        total_count: this.$store.state.modules.statistics.total_count
      }
    },
    chartData_player() {
      return this.getChartData(this.playerData)
    },
    chartData_all() {
      return this.getChartData(this.allData)
    },
    chartOptions_all() {
      const total_count = this.allData.total_count
      return {
        title: {
          text: [
            'Current Rarity Distribution For All Players',
            `(Total Sample Count: ${total_count})`
          ],
          display: true
        }
      }
    },
    chartOptions_player() {
      const total_count = this.playerData.total_count
      return {
        title: {
          text: [
            'Current Rarity Distribution For You Only',
            `(Total Sample Count: ${total_count})`
          ],
          display: true
        }
      }
    },
    table_data_all() {
      return this.getTableData({
        raw_data: this.allData.raw_data,
        total_count: this.allData.total_count,
        probabilities: this.$store.state.modules.cards.probabilities
      })
    },
    table_data_player() {
      return this.getTableData({
        raw_data: this.playerData.raw_data,
        total_count: this.playerData.total_count,
        probabilities: this.$store.state.modules.cards.probabilities
      })
    }
  },
  methods: {
    getTableData({ raw_data, total_count, probabilities }) {
      const res = {
        actual_data: {},
        expected_data: {},
        df: Object.keys(raw_data).length - 1,
        significance_level: 0.05
      }
      Object.assign(res.actual_data, raw_data)
      for (const i of Object.keys(raw_data)) {
        res.expected_data[i] = (total_count * probabilities[i]) / 100
      }

      return res
    },
    getChartData({ raw_data, proportion }) {
      if (this.alive) {
        this.$store.commit('modules/statistics/update_prob')
      }
      // const raw_data = this.$store.state.modules.statistics.rarity_counter
      // const prob = this.$store.state.modules.statistics.probabilities
      const data = []
      const labels = []
      const backgroundColor = []
      const list = Object.keys(raw_data)
      list.sort()
      for (const rarity of list) {
        labels.push('rarity' + rarity + `(${proportion[rarity].toFixed(2)}%)`)
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
    }
  }
}
</script>

<style scoped>
.chart {
  margin: auto;
}
</style>
