<template>
  <b-form inline>
    <label class="sr-only" for="searchValue">searchValue</label>
    <b-input
      id="searchValue"
      v-model="searchValue"
      class="mr-sm-2"
      style="line-height: 1"
      placeholder="Search by name"
      size="sm"
      @keypress.enter.prevent="$eventBus.$emit('searchAgentName', searchValue)"
    />
    <b-button
      class="my-2 my-sm-0"
      size="sm"
      variant="outline-success"
      @click.prevent="$eventBus.$emit('searchAgentName', searchValue)"
    >
      Search
    </b-button>
  </b-form>
</template>

<script>
export default {
  name: 'SearchButton',
  data() {
    return { searchValue: '' }
  }
}
</script>

<style scoped></style>
