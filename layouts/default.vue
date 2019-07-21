<template>
  <div>
    <nav-bar />

    <div class="container">
      <nuxt keep-alive :keep-alive-props="{ include: ['Play'] }" />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
// import MessageBox from '~/components/ui/MessageBox'

export default {
  components: {
    NavBar: NavBar
    // MeesageBox: MessageBox
  }
}
</script>
<style>
html {
  font-family: 'Noto Sans', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  overflow-y: scroll;
  /*-ms-text-size-adjust: 100%;*/
  /*-webkit-text-size-adjust: 100%;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*-webkit-font-smoothing: antialiased;*/
  box-sizing: border-box;
}
h1 {
  font-family: 'Sedgwick Ave';
  font-size: 48px;
}
body {
  font-family: 'Noto Sans';
  /*margin-right: -16px;*/
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
