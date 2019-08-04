<template>
  <strong v-if="gameStatus" class="navbar-text navbar-right">
    Gemstones: {{ value }}
    <img :src="gemstoneUrl" alt="gemstone_icon" class="mx-0 px-0" />
  </strong>
</template>

<script>
export default {
  name: 'Tag',
  // props: {
  //   value: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  computed: {
    gameStatus() {
      return this.$store.state.gameStatus
    },
    value() {
      if (!this.gameStatus) {
        return 0
      }
      return this.$store.state.modules.playerAgents.agents.player1.balance
    },
    gemstoneUrl() {
      return require(process.env.gemstoneUrl)
    }
  }
}
</script>

<style scoped></style>
