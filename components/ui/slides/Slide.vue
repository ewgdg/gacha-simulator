<template>
  <transition :name="transitionName">
    <div v-show="display" class="mySlide" :style="{ height: height + 'px' }">
      <slot> </slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Slide',
  props: {
    height: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      display: false,
      reversed: false
    }
  },
  computed: {
    transitionName() {
      if (this.reversed) {
        return 'reversed'
      }
      return ''
    }
  },
  created() {
    if (this.$attrs.active !== undefined && this.$attrs.active !== 'false') {
      this.display = true
    }
  }
}
</script>

<style scoped>
.mySlide {
  /*background-color: gold;*/
  position: absolute;
  width: 100%;
}

.v-leave-active {
  transition: all 1s linear;
}
.v-leave-to {
  transform: translate3d(-100%, 0, 0);
}
.v-enter {
  transform: translate3d(100%, 0, 0);
}
.v-enter-active {
  transition: all 1s linear;
  z-index: 1;
}

.reversed-leave-active {
  transition: all 1s linear;
}
.reversed-leave-to {
  transform: translate3d(100%, 0, 0);
}
.reversed-enter {
  transform: translate3d(-100%, 0, 0);
}
.reversed-enter-active {
  transition: all 1s linear;
  z-index: 1;
}
</style>
