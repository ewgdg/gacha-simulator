<template>
  <div>
    <LootBoxView />
  </div>
</template>

<script>
// import NavBar from '~/components/NavBar.vue'
import UnboxView from '~/components/lootbox/UnboxView.vue'
export default {
  name: 'HomePage',
  components: {
    // NavBar,
    LootBoxView: UnboxView
  },
  data() {
    return {
      drawed: ''
    }
  }
}
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
