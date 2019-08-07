<template>
  <b-form inline>
    <!--    <label class="sr-only" for="value-1">searchValue</label>-->
    <b-input
      id="value-1"
      v-model="searchValue"
      class="mr-sm-2"
      style="line-height: 1"
      placeholder="Search by name"
      size="sm"
      @keypress.enter.prevent="sendSearchEvent()"
    />
    <b-button
      class="my-2 my-sm-0"
      size="sm"
      variant="outline-success"
      @click.prevent="sendSearchEvent()"
    >
      Search
    </b-button>
  </b-form>
</template>

<script>
export default {
  name: 'SearchButton',
  props: {
    tableId: {
      type: String,
      default: ''
    }
  },
  data() {
    return { searchValue: '' }
  },
  methods: {
    sendSearchEvent() {
      this.$eventBus.$emit('searchAgentName' + this.tableId, this.searchValue)
    }
  }
}
</script>

<style scoped></style>
