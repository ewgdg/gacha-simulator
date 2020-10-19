<template>
  <div
    style="height: 40vh"
    class="d-flex align-items-center justify-content-center"
  >
    <p v-if="loading">
      Loading
    </p>
    <p v-else class="text-warning">
      You need to sign in first. To sign in, click user on the nav bar.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      loading: true
    }
  },
  watch: {
    '$store.state.user'(to, from) {
      if (!from && to) {
        let toRoute = '/play'
        if (this.$route.query.from) {
          toRoute = this.$route.query.from
        }
        this.$router.replace(toRoute)
      }
    }
  },
  created() {
    // await this.$waitForNuxt
    let to = '/play'
    if (this.$route.query) {
      to = this.$route.query.from
    }
    if (this.$store.state.user) {
      this.$router.replace(to)
    } else {
      this.loading = false
    }
  }
}
</script>

<style scoped></style>
