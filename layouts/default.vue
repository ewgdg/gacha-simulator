<template>
  <div>
    <nav-bar />
    <template v-if="blocking > 0">
      <LoadingSpinner style="z-index: 100000"></LoadingSpinner>
      <Blocker style="z-index: 100000"></Blocker>
    </template>
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
import TerminateGame from '~/components/gameStatus/TerminateGame.js'
import LoadingSpinner from '~/components/ui/LoadingSpinner'
import Blocker from '~/components/ui/Blocker'
// import MessageBox from '~/components/ui/MessageBox'

export default {
  components: {
    NavBar: NavBar,
    LoadingSpinner,
    Blocker
    // MeesageBox: MessageBox
  },
  mixins: [TerminateGame],
  data() {
    return {
      blocking: 0
    }
  },
  created() {
    this.$eventBus.$on('block', this.block)
    this.$eventBus.$on('unblock', this.unblock)
    // add message dialog
    this.$eventBus.$on('message', (message) => {
      this.$bvModal.msgBoxConfirm(message, {
        title: 'Notification',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'success',
        headerClass: 'p-2 border-bottom-0 text-success',
        footerClass: 'p-2 border-top-0',
        centered: true
      })
    })
  },
  methods: {
    unblock() {
      // console.log(this.blocking)
      this.blocking--
    },
    block() {
      // console.log('bb' + this.blocking)
      this.blocking++
    }
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
  height: 100vh;

  background: url('~assets/images/background/bg.png');
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;

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
