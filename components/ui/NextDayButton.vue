<template>
  <span>
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

    <DayHint v-if="displayHint" @dayHint.once="displayHint = false"></DayHint>
  </span>
</template>

<script>
import DayHint from '~/components/ui/DayHint'

export default {
  name: 'NextDayButton',
  components: {
    DayHint: DayHint
  },
  data() {
    return {
      displayHint: true
    }
  },
  computed: {
    day() {
      return this.$store.state.modules.statistics.day
    }
  },
  mounted() {
    this.$on('dayHint', () => {
      this.displayHint = false
    })
  },
  methods: {
    increaseDay() {
      this.$store.dispatch('nextDay')
      this.displayHint = true
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
    opacity: 0;
  }
  to {
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
