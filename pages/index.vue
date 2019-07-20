<template>
  <div>
    <BackgroundStory></BackgroundStory>
  </div>
</template>

<script>
// import NavBar from '~/components/NavBar.vue'
import BackgroundStory from '~/components/introduction/BackgroundStory.vue'
// import Explanation from '~/components/introduction/Explanation.vue'
export default {
  name: 'HomePage',
  components: {
    BackgroundStory: BackgroundStory
  }
}
</script>

<style></style>
