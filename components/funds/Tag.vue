<template>
  <strong class="navbar-text navbar-right"
    >Gemstones: {{ value }}
    <img :src="gemstoneUrl" alt="gemstone_icon" class="mx-0 px-0" />
  </strong>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Tag',
  // props: {
  //   value: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  computed: {
    ...mapState('modules/funds', {
      value: (state) => state.balance
    }),

    gemstoneUrl() {
      return require(process.env.gemstoneUrl)
    }
  }
}
</script>

<style scoped></style>
