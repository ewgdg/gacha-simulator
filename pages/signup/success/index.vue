<template>
  <div>
    <p class="text-success">
      You have successfully create your account.
    </p>
    <div class="d-flex align-items-center">
      <b-spinner style="width: 1rem; height: 1rem" variant="info"></b-spinner>
      <span class="pl-1 text-info"
        >Redirecting to home page in {{ count }}s.</span
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      count: 5,
      interval: null
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count--
      if (this.count <= 0) {
        clearTimeout(this.interval)
        setTimeout(() => this.$router.replace('/'), 500)
      }
    }, 1000)
  },
  beforeRouteLeave(to, from, next) {
    clearTimeout(this.interval)
    next()
  }
}
</script>

<style scoped></style>
