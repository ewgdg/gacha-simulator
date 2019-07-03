<template>
  <div class="d-flex justify-content-around">
    <svg
      v-for="i in rarity"
      :key="i"
      viewBox="0 0 200 200"
      width="16.5%"
      class="m-0 p-0"
    >
      <polygon
        points="100,10 40,198 190,78 10,78 160,198"
        style="fill:orange;"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'RarityLabel',
  props: {
    rarity: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped></style>
