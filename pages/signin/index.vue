<template>
  <div
    style="height: 40vh"
    class="d-flex align-items-center justify-content-center"
  >
    <p class="text-warning">
      You need to sign in first. To sign in, click user on the nav bar.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Index',
  async created() {
    await this.$waitForNuxt
    let to = '/play'
    if (this.$route.query) {
      to = this.$route.query.from
    }
    if (this.$store.state.user) {
      this.$router.replace(to)
    }
  }
}
</script>

<style scoped></style>
