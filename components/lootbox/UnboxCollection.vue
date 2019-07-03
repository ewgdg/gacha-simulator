<template>
  <table
    class="table table-bordered table-hover table-sm mx-auto w-75 table-responsive-sm"
  >
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Portrait</th>
        <th scope="col" class="clickable" @click="changeSortOrder('rarity')">
          Rarity
          <span class="arrow" :class="getArrowClass('rarity')"></span>
        </th>
        <th scope="col" class="clickable" @click="changeSortOrder('name')">
          Name
          <span class="arrow" :class="getArrowClass('name')"></span>
        </th>
        <th scope="col" class="clickable" @click="changeSortOrder('owned')">
          Owned <span class="arrow" :class="getArrowClass('owned')"></span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(name, i) in sortedCards"
        :key="name"
        :class="highlight_class(name)"
      >
        <th scope="row">{{ i }}</th>

        <td style="width: 10%">
          <agent-portrait :name="name" class="rounded"></agent-portrait>
        </td>
        <td style="width: 15%">
          <rarity-label :rarity="getRarity(name)"></rarity-label>
        </td>
        <td>{{ name }}</td>

        <td>{{ getOwnedCount(name) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters } from 'vuex'
import RarityLabel from '~/components/lootbox/RarityLabel.vue'
import AgentPortrait from '~/components/lootbox/AgentPortrait.vue'
export default {
  name: 'UnBoxSummary',
  components: {
    RarityLabel: RarityLabel,
    AgentPortrait: AgentPortrait
  },
  data() {
    return {
      sortKey: 'rarity',
      sortOrder: {
        rarity: -1,
        name: -1,
        owned: -1
      },
      searchedValue: ''
    }
  },
  computed: {
    ...mapGetters({
      getOwnedCards: 'modules/players/getCards',
      getCardInfo: 'modules/cards/getCardInfo'
    }),
    sortedCards() {
      return Object.keys(this.getOwnedCards)
        .sort(this.comparatorFactory(this))
        .filter(this.filterNameTestFactory(this.searchedValue))
    },
    curSortOrder() {
      return this.sortOrder[this.sortKey]
    }
  },
  created() {
    this.$eventBus.$on('searchAgentName', (event) => {
      this.searchedValue = event
    })
  },
  methods: {
    highlight_class(name) {
      const rarity = this.getRarity(name)
      return {
        'table-danger': rarity === 6,
        'table-warning': rarity === 5,
        'table-primary': rarity === 4,
        'table-success': rarity === 3,
        'table-info': rarity === 2
      }
    },
    comparatorFactory: (vm) => {
      return (a, b) => {
        if (vm.sortKey === 'rarity') {
          a = vm.getRarity(a)
          b = vm.getRarity(b)
        } else if (vm.sortKey === 'name') {
          //
        } else if (vm.sortKey === 'owned') {
          a = vm.getOwnedCount(a)
          b = vm.getOwnedCount(b)
        }
        return (a === b ? 0 : a > b ? 1 : -1) * vm.curSortOrder
      }
    },

    getRarity(name) {
      return this.getCardInfo(name).rarity
    },
    getArrowClass(key) {
      return {
        'sort-activate': this.sortKey === key,
        asc: this.sortOrder[key] > 0,
        dsc: this.sortOrder[key] <= 0
      }
    },
    changeSortOrder(key) {
      if (this.sortKey === key) {
        this.sortOrder[key] = this.sortOrder[key] * -1
      }
      this.sortKey = key
    },
    getOwnedCount(name) {
      return this.getOwnedCards[name].count
    },
    filterNameTestFactory: (name) => (item) => {
      if (!name) {
        return true
      }
      return item.match(new RegExp(name, 'i'))
    }
  }
}
</script>

<style scoped>
.arrow.sort-activate {
  opacity: 1;
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0px;
  height: 0px;
  margin-left: 5px;
  opacity: 0.2;
  cursor: pointer;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 5px solid red;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid red;
}
.clickable {
  user-select: none;
  cursor: pointer;
}
</style>
