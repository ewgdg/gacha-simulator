<template>
  <div v-if="user" class="glass-paper">
    <b-card
      bg-variant="dark"
      text-variant="white"
      :title="user ? user.displayName : 'Unknown'"
    >
      <b-card-text>
        Highest Score:
        {{ highest_score }}
      </b-card-text>
    </b-card>
    <em>Most Recent Plays:</em>
    <b-table v-if="tableData.length > 0" hover small :items="tableData">
    </b-table>
    <p v-else class="text-warning">
      There is no record on your profile.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Index',
  computed: {
    user() {
      return this.$store.state.user
    },
    tableData() {
      const data = []
      for (const record of this.$store.state.userHistory) {
        data.push({
          date: new Date(record.timeStamp.seconds * 1000),
          score: record.score.toFixed(2),
          local_rank: record.localRank
        })
      }
      return data
    },
    highest_score() {
      if (!this.user.highest_score) {
        return 'None'
      }
      return typeof this.user.highest_score === 'number'
        ? this.user.highest_score.toFixed(2)
        : 'None'
    }
  }
}
</script>

<style scoped></style>
