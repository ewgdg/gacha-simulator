<template>
  <div>
    <table
      class="table table-bordered table-hover table-sm mx-auto w-100 table-responsive-sm"
    >
      <thead>
        <tr>
          <th scope="col">#</th>

          <th scope="col" class="clickable" @click="changeSortOrder('name')">
            <span class="d-inline-flex flex-row">
              <span class="align-self-end">
                Name
                <span class="arrow" :class="getArrowClass('name')"> </span>
              </span>
              <SearchButton
                style="z-index: 1; margin-left: 3px"
                @click.native.stop
              ></SearchButton>
            </span>
          </th>
          <th scope="col" class="clickable" @click="changeSortOrder('data')">
            {{ dataColumnName }}
            <span class="arrow" :class="getArrowClass('data')"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(agent, i) in pageData"
          :key="agent.name"
          :class="highlight_class(agent.name)"
        >
          <th scope="row">{{ i + 1 + offset }}</th>

          <td>
            {{
              agent
                ? agent.name === 'player1'
                  ? user.displayName
                  : agent.name
                : 'undefined'
            }}
          </td>

          <td>{{ getData(agent).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center w-100">
      <b-pagination
        v-if="isPagination"
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="rank-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import RarityLabel from '~/components/lootbox/RarityLabel.vue'
// import AgentPortrait from '~/components/lootbox/AgentPortrait.vue'
import SearchButton from '~/components/ui/SearchButton'
export default {
  name: 'RankTable',
  components: {
    // RarityLabel: RarityLabel,
    // AgentPortrait: AgentPortrait,
    SearchButton: SearchButton
  },
  props: {
    dataColumnName: {
      type: String,
      default: 'Owned'
    },
    getData: {
      type: Function,
      default: (name) => {
        return 'undefined'
      }
    },
    agentsProp: {
      type: Array,
      default: null
    },
    isPagination: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      sortKey: 'data',
      sortOrder: {
        rarity: -1,
        name: -1,
        data: -1
      },
      searchedValue: '',
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters({
      getCards: 'modules/playerAgents/getCards',
      getCardInfo: 'modules/cards/getCardInfo'
    }),
    OwnedCards() {
      return this.getCards('player1')
    },
    sorted() {
      return this.agents
        .slice(0)
        .sort(this.comparatorFactory(this))
        .filter(this.filterNameTestFactory(this.searchedValue))
    },
    curSortOrder() {
      return this.sortOrder[this.sortKey]
    },
    agents() {
      if (this.agentsProp) return this.agentsProp
      return Object.values(this.$store.state.modules.playerAgents.agents)
    },
    player() {
      return this.$store.state.modules.playerAgents.agents.player1
    },
    user() {
      return this.$store.state.user
    },
    rows() {
      return this.agents.length
    },
    pageData() {
      if (!this.isPagination) return this.sorted
      const start = (this.currentPage - 1) * this.perPage
      const end = Math.min(this.rows, start + this.perPage)
      return this.generator(this.sorted, start, end, 1)
    },
    offset() {
      return (this.currentPage - 1) * this.perPage
    }
  },
  created() {
    this.$eventBus.$on('searchAgentName', (event) => {
      this.searchedValue = event
    })
  },
  methods: {
    highlight_class(name) {
      return {
        'table-warning': this.player ? name === this.player.name : false
      }
    },
    comparatorFactory: (vm) => {
      if (vm.sortKey === 'name') {
        return (a, b) => {
          a = a.name
          b = b.name
          let res = 1
          if (a.length > b.length) {
            res = 1
          } else if (a.length < b.length) {
            res = -1
          } else {
            res = a === b ? 0 : a > b ? 1 : -1
          }
          return res * vm.curSortOrder
        }
      } else if (vm.sortKey === 'data') {
        return (a, b) => {
          a = vm.getData(a)
          b = vm.getData(b)
          return (a === b ? 0 : a > b ? 1 : -1) * vm.curSortOrder
        }
      } else {
        return (a, b) => {
          return 0
        }
      }
      // console.log(a + ' ' + b + ' ' + (a === b ? 0 : a > b ? 1 : -1))
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
      return this.OwnedCards[name]
    },
    filterNameTestFactory: (name) => (item) => {
      if (!name) {
        return true
      }
      return item.name.match(new RegExp(name, 'i'))
    },
    generator: function*(list = [], start = 0, end = 0, step = 1) {
      for (let i = start; i < end; i += step) {
        yield list[i]
      }
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
</style>
