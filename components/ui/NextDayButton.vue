<template>
  <span
    v-if="$store.state.gameStart"
    class="text-nowrap"
    @click="increaseDay()"
  >
    <span>Day</span>
    <transition name="slide-down">
      <span :key="day"> {{ day }} </span>
    </transition>
    <span> >> </span>
  </span>
</template>

<script>
export default {
  name: 'NextDayButton',
  computed: {
    day() {
      return this.$store.state.modules.statistics.day
    }
  },
  methods: {
    increaseDay() {
      this.$store.dispatch('nextDay')
    }
  }
}
</script>

<style scoped>
.slide-down-enter-active {
  animation: fade-in 1s forwards ease;
}
.slide-down-leave-active {
  animation: slide-down-out 1s forwards ease;
  position: absolute;
}
@keyframes fade-in {
  from {
    /*transform: translateY(-20px);*/
    opacity: 0;
  }
  to {
    /*transform: translateY(0);*/
    opacity: 1;
  }
}
@keyframes slide-down-out {
  from {
    transform: translateY(0px);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
