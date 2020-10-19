<template>
  <div>
    <h5 style="margin-top:10px;font-weight: bold;">
      Goodness Of Fit Test <br />(Pearson's Chi-Square Test)
    </h5>
    <b-table
      striped
      hover
      responsive
      small
      :items="table_items"
      :fields="table_fields"
    ></b-table>
    <p class="strip">
      Null Hypothesis: The given data fits to the announced probabilities.
    </p>
    <p class="strip">Significance Level: {{ data.significance_level }}</p>

    <p class="strip">Chi-Sqaure Statistic: {{ chi_square_sum.toFixed(2) }}</p>
    <p class="strip">Degree Of Freedom: {{ data.df }}</p>
    <p class="strip">
      {{ p_value[0] }} &lt;= p-value = P(chi sqaure>={{
        chi_square_sum.toFixed(2)
      }}) &lt;=
      {{ p_value[1] }}
    </p>
    <p
      v-if="p_value[0] >= data.significance_level"
      class="strip"
      style="font-weight:bold"
    >
      The null hypothesis is failed to be rejected.
    </p>
    <p v-else class="strip" style="font-weight:bold">
      The null hypothesis is rejected.
    </p>
  </div>
</template>

<script>
export default {
  name: 'GoodnessOfFitTest',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chi_sqaure_dist_table: {
        1: [0.0, 0.0, 0.0, 0.0, 0.02, 2.71, 3.84, 5.02, 6.63],
        2: [0.01, 0.02, 0.05, 0.1, 0.21, 4.61, 5.99, 7.38, 9.21],
        3: [0.07, 0.11, 0.22, 0.35, 0.58, 6.25, 7.81, 9.35, 11.34],
        4: [0.21, 0.3, 0.48, 0.71, 1.06, 7.78, 9.49, 11.14, 13.28],
        5: [0.41, 0.55, 0.83, 1.15, 1.61, 9.24, 11.07, 12.83, 15.09],
        6: [0.68, 0.87, 1.24, 1.64, 2.2, 10.64, 12.59, 14.45, 16.81],
        7: [0.99, 1.24, 1.69, 2.17, 2.83, 12.02, 14.07, 16.01, 18.48],
        8: [1.34, 1.65, 2.18, 2.73, 3.49, 13.36, 15.51, 17.53, 20.09],
        9: [1.73, 2.09, 2.7, 3.33, 4.17, 14.68, 16.92, 19.02, 21.67],
        10: [2.16, 2.56, 3.25, 3.94, 4.87, 15.99, 18.31, 20.48, 23.21],
        11: [2.6, 3.05, 3.82, 4.57, 5.58, 17.28, 19.68, 21.92, 24.72],
        12: [3.07, 3.57, 4.4, 5.23, 6.3, 18.55, 21.03, 23.34, 26.22],
        13: [3.57, 4.11, 5.01, 5.89, 7.04, 19.81, 22.36, 24.74, 27.69],
        14: [4.07, 4.66, 5.63, 6.57, 7.79, 21.06, 23.68, 26.12, 29.14],
        15: [4.6, 5.23, 6.26, 7.26, 8.55, 22.31, 25.0, 27.49, 30.58],
        16: [5.14, 5.81, 6.91, 7.96, 9.31, 23.54, 26.3, 28.85, 32.0],
        17: [5.7, 6.41, 7.56, 8.67, 10.09, 24.77, 27.59, 30.19, 33.41],
        18: [6.26, 7.01, 8.23, 9.39, 10.86, 25.99, 28.87, 31.53, 34.81],
        19: [6.84, 7.63, 8.91, 10.12, 11.65, 27.2, 30.14, 32.85, 36.19],
        20: [7.43, 8.26, 9.59, 10.85, 12.44, 28.41, 31.41, 34.17, 37.57],
        22: [8.64, 9.54, 10.98, 12.34, 14.04, 30.81, 33.92, 36.78, 40.29],
        24: [9.89, 10.86, 12.4, 13.85, 15.66, 33.2, 36.42, 39.36, 42.98],
        26: [11.16, 12.2, 13.84, 15.38, 17.29, 35.56, 38.89, 41.92, 45.64],
        28: [12.46, 13.56, 15.31, 16.93, 18.94, 37.92, 41.34, 44.46, 48.28],
        30: [13.79, 14.95, 16.79, 18.49, 20.6, 40.26, 43.77, 46.98, 50.89],
        32: [15.13, 16.36, 18.29, 20.07, 22.27, 42.58, 46.19, 49.48, 53.49],
        34: [16.5, 17.79, 19.81, 21.66, 23.95, 44.9, 48.6, 51.97, 56.06],
        38: [19.29, 20.69, 22.88, 24.88, 27.34, 49.51, 53.38, 56.9, 61.16],
        42: [22.14, 23.65, 26.0, 28.14, 30.77, 54.09, 58.12, 61.78, 66.21],
        46: [25.04, 26.66, 29.16, 31.44, 34.22, 58.64, 62.83, 66.62, 71.2],
        50: [27.99, 29.71, 32.36, 34.76, 37.69, 63.17, 67.5, 71.42, 76.15],
        55: [31.73, 33.57, 36.4, 38.96, 42.06, 68.8, 73.31, 77.38, 82.29],
        60: [35.53, 37.48, 40.48, 43.19, 46.46, 74.4, 79.08, 83.3, 88.38],
        65: [39.38, 41.44, 44.6, 47.45, 50.88, 79.97, 84.82, 89.18, 94.42],
        70: [43.28, 45.44, 48.76, 51.74, 55.33, 85.53, 90.53, 95.02, 100.43],
        75: [47.21, 49.48, 52.94, 56.05, 59.79, 91.06, 96.22, 100.84, 106.39],
        80: [51.17, 53.54, 57.15, 60.39, 64.28, 96.58, 101.88, 106.63, 112.33],
        85: [55.17, 57.63, 61.39, 64.75, 68.78, 102.08, 107.52, 112.39, 118.24],
        90: [59.2, 61.75, 65.65, 69.13, 73.29, 107.57, 113.15, 118.14, 124.12],
        95: [63.25, 65.9, 69.92, 73.52, 77.82, 113.04, 118.75, 123.86, 129.97],
        100: [67.33, 70.06, 74.22, 77.93, 82.36, 118.5, 124.34, 129.56, 135.81],
        table_col_labels: [
          0.995,
          0.99,
          0.975,
          0.95,
          0.9,
          0.1,
          0.05,
          0.025,
          0.01
        ]
      }
    }
  },
  computed: {
    chi_square_statistic() {
      const actual_data = this.data.actual_data
      const expected_data = this.data.expected_data

      const res = []
      for (const i of Object.keys(actual_data)) {
        res.push((actual_data[i] - expected_data[i]) ** 2 / expected_data[i])
      }
      return res
    },
    chi_square_sum() {
      return this.chi_square_statistic.reduce((a, b) => a + b, 0)
    },
    p_value() {
      return this.find_p_value({
        target: this.chi_square_sum,
        df: this.data.df
      })
    },
    table_items() {
      const res = [
        { Category: 'Observed' },
        { Category: 'Expected' },
        { Category: 'Chi Sqaure Component' }
      ]

      Object.assign(res[0], this.data.actual_data)
      Object.assign(
        res[1],
        Object.keys(this.data.expected_data).reduce((result, key) => {
          result[key] = this.data.expected_data[key].toFixed(2)
          return result
        }, {})
      )

      const keys = Object.keys(this.data.actual_data)
      this.chi_square_statistic.forEach((val, index) => {
        res[2][keys[index]] = val.toFixed(2)
      })

      return res
    },
    table_fields() {
      return ['Category'].concat(Object.keys(this.data.actual_data))
    }
  },
  methods: {
    get_col_label(i) {
      return this.table_col_labels[i]
    },
    // p_value= p(chi^2 >=target)
    // ret: [range0 range1]  where  range0<=p<=range1
    find_p_value({ target, df }) {
      const row = this.chi_sqaure_dist_table[df]

      let left = 0
      let right = row.length - 1

      while (left <= right) {
        const mid = left + ~~((right - left) / 2)
        const val = row[mid]
        if (target <= val) {
          right = mid - 1
        } else {
          left = mid + 1
        }
      }

      if (target === row[left]) {
        const exact_p = this.chi_sqaure_dist_table.table_col_labels[left]
        return [exact_p, exact_p]
      } else {
        const left_bound =
          left >= row.length
            ? 0
            : this.chi_sqaure_dist_table.table_col_labels[left]
        const right_bound =
          left === 0 ? 1 : this.chi_sqaure_dist_table.table_col_labels[left - 1]
        return [left_bound, right_bound]
      }
    }
  }
}
</script>
<style scoped>
.strip:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.strip {
  margin-bottom: 0.5rem;
}
</style>
