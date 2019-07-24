<template>
  <div>
    <img
      :src="getUrl"
      alt="agent_photo"
      style="width: 100%;background-color: #7F828B"
    />
  </div>
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
