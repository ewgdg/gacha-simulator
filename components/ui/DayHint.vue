<template>
  <div class="screen-size d-flex justify-content-around align-content-around">
    <transition
      name="fade"
      type="animation"
      appear
      @after-enter="reset"
      @before-enter="init"
    >
      <div
        :key="day"
        style="width: 100%;line-height: 100vh;"
        class="text-center hint"
      >
        Day {{ day }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DayHint',
  computed: {
    day() {
      return this.$store.state.modules.statistics.day
    }
  },
  methods: {
    reset(el) {
      el.zIndex = -1
    },
    init(el) {
      // el.zIndex = 0
    }
  }
}
</script>

<style scoped>
.screen-size {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

.hint {
  opacity: 0;
  font-size: 0;
}
.fade-enter {
  /*opacity: 0;*/
  font-size: 0;
  /*transform: scale(0);*/
}

.fade-enter-to {
  /*opacity: 1;*/
  font-size: 10vw;
}

.fade-enter-active {
  transition: font-size 1.5s;
  animation: fade-in-out 2s forwards ease-in-out;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
