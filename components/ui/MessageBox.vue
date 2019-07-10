<template>
  <div class="container-outer">
    <div
      class="bottom-button"
      @click="
        bottom = true
        scrollDown()
      "
    >
      goto bottom
    </div>
    <div ref="chatWindow" class="chat-container" @scroll="handleScroll($event)">
      <div v-for="(message, i) in messages" :key="i" class="message">
        <p class="text-wrap text-break m-1">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  data() {
    return {
      bottom: true,
      scrolling: false
    }
  },
  computed: {
    messages() {
      return this.$store.getters['modules/messages/getMessages']
    }
  },
  mounted() {
    setInterval(this.scrollDown, 100)
    this.$store.dispatch('modules/messages/init')
  },
  methods: {
    scrollDown() {
      if (this.bottom && this.$refs.chatWindow) {
        const box = this.$refs.chatWindow
        const target = box.scrollHeight - box.clientHeight
        if (box.scrollTop !== target) {
          this.scrolling = true
          box.scrollTop = target
        }
      }
    },
    handleScroll(event) {
      if (this.scrolling) {
        this.scrolling = false
        return false
      }
      const el = event.target
      if (el.scrollTop + el.clientHeight === el.scrollHeight) {
        // console.log(true)
        this.bottom = true
      } else {
        // console.log(false)
        this.bottom = false
      }
    }
  }
}
</script>

<style scoped>
.container-outer {
  width: 50vw;
  border: solid 1px #ccc;
  border-radius: 5px;
  overflow: hidden;
  position: fixed;
  bottom: 2vh;
  right: 25vw;
  opacity: 0.8;
}
.container-outer:hover {
  opacity: 1;
}
.container-outer:before {
  content: '';
  background-color: rgba(39, 139, 45, 0.2);
  filter: blur(0.5rem);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -1;
}

.bottom-button {
  font-size: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  background-color: rgba(82, 79, 79, 0.9);
  position: absolute;
  left: 0;
  right: 0;
  height: 0.8rem;
  bottom: 0;
  z-index: 0;
  opacity: 0.3;
  color: white;
}
.bottom-button:hover {
  opacity: 1;
}

.chat-container {
  height: 12vh;
  overflow-y: auto;
}
.chat-container .message {
  border-bottom: solid 1px #ccc;
  padding: auto;
}
.chat-container .message .avatar {
  float: left;
  margin-right: 5px;
}
.chat-container .message .datetime {
  float: right;
  color: #999;
}
.send-message-form input {
  width: 100%;
  border: none;
  font-size: 16px;
  padding: 10px;
}
.send-message-form button {
  display: none;
}
</style>
