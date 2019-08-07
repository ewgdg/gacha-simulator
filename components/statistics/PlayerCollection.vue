<template>
  <div>
    <CardTable table-id="playerCollection"></CardTable>
  </div>
</template>

<script>
import CardTable from '~/components/ui/CardTable'
export default {
  name: 'UnBoxSummary',
  components: {
    CardTable: CardTable
  }
}
</script>

<style scoped></style>
