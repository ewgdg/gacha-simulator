<template>
  <div>
    <nav-bar />
    <TerminateGame></TerminateGame>
    <div class="container">
      <nuxt
        keep-alive
        :keep-alive-props="{ include: ['Play', 'Statistics'] }"
      />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
import TerminateGame from '~/components/gameStatus/TerminateGame'
// import MessageBox from '~/components/ui/MessageBox'

export default {
  components: {
    NavBar: NavBar,
    TerminateGame
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
  /*overflow-y: scroll;*/
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
  overflow-y: scroll;
  overflow-x: hidden;
  background: url('~assets/images/background/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  /*to prevent bootstrap modal to add padding*/
  padding-right: 0px !important;
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
.modal-open {
  padding-right: 0;
  overflow-y: scroll;
}
</style>
