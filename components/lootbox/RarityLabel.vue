<template>
  <div class="d-flex justify-content-around align-items-center">
    <img
      v-for="i in rarity"
      :key="i"
      width="16.5%"
      class="hidden-back"
      src="~/assets/images/icons/star.svg"
    />
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
