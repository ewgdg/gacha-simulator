<template>
  <img :src="getUrl" alt="agent_photo" class="img-fluid" width="100%" />
</template>

<script>
export default {
  name: 'AgentPortrait',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    getUrl() {
      return require(`@/assets/images/agents/${this.name}.png`)
    }
  }
}
</script>

<style scoped></style>
