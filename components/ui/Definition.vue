<template>
  <span v-b-toggle="toggleId" class="clickable">
    <u><slot></slot></u><small><sup>[+]</sup></small>
  </span>
</template>

<script>
export default {
  name: 'Definition',
  props: {
    toggleId: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped></style>
