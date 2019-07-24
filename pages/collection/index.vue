<template>
  <PlayerCollection></PlayerCollection>
</template>

<script>
import PlayerCollection from '~/components/statistics/PlayerCollection.vue'

export default {
  name: 'SummaryPage',
  components: {
    PlayerCollection: PlayerCollection
  }
}
</script>

<style scoped></style>
