<template v-if="gameStatus">
  <strong class="navbar-text navbar-right"
    >Gemstones: {{ value }}
    <img :src="gemstoneUrl" alt="gemstone_icon" class="mx-0 px-0" />
  </strong>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tag',
  // props: {
  //   value: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  computed: {
    ...mapGetters('modules/playerAgents', {
      getBalance: 'getBalance'
    }),
    gameStatus() {
      return this.$store.state.gameStatus
    },
    value() {
      if (!this.gameStatus) {
        return 0
      }
      return this.getBalance('player1')
    },
    gemstoneUrl() {
      return require(process.env.gemstoneUrl)
    }
  }
}
</script>

<style scoped></style>
