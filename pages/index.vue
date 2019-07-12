<template>
  <div>
    <unbox-button />
    <unbox-result />
    <MessageBox></MessageBox>
  </div>
</template>

<script>
// import NavBar from '~/components/NavBar.vue'
import UnboxButton from '~/components/lootbox/UnboxButton.vue'
import UnboxResult from '~/components/lootbox/UnboxResult.vue'
import MessageBox from '~/components/ui/MessageBox'

export default {
  name: 'HomePage',
  components: {
    UnboxResult,
    // NavBar,
    UnboxButton,
    MessageBox: MessageBox
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
