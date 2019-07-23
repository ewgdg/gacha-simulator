<template>
  <div>
    <no-ssr>
      <LocalRank></LocalRank>
      <p slot="placeholder">Loading</p>
    </no-ssr>
  </div>
</template>

<script>
import LocalRank from '~/components/evaluation/LocalRank'

export default {
  name: 'Index',
  components: {
    LocalRank: LocalRank
  }
}
</script>

<style scoped></style>
