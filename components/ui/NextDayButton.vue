<template>
  <span>
    <span
      v-if="$store.state.gameStatus"
      class="text-nowrap"
      @click="increaseDay()"
    >
      <span>Day</span>
      <transition name="slide-down">
        <span :key="day"> {{ day }} </span>
      </transition>
      <span> >> </span>
    </span>
    <LoadingSpinner v-if="loading"></LoadingSpinner>
    <Blocker v-if="loading"></Blocker>
    <DayHint v-if="displayHint" @dayHint.once="displayHint = false"></DayHint>
  </span>
</template>

<script>
import DayHint from '~/components/ui/DayHint'
import LoadingSpinner from '~/components/ui/LoadingSpinner'
import Blocker from '~/components/ui/Blocker'
export default {
  name: 'NextDayButton',
  components: {
    DayHint: DayHint,
    LoadingSpinner: LoadingSpinner,
    Blocker: Blocker
  },
  data() {
    return {
      displayHint: false,
      loading: false
    }
  },
  computed: {
    day() {
      return this.$store.state.modules.statistics.day
    }
  },
  mounted() {
    this.displayHint = true
  },
  methods: {
    async increaseDay() {
      // stop any un-finished animation
      this.displayHint = false
      await this.$nextTick()
      this.loading = true
      this.$store.commit('modules/lootboxResult/reset')

      return this.$store.dispatch('nextDay').then(() => {
        this.displayHint = true
        // set timeout to continue to block the delayed clicks for a while
        setTimeout(() => {
          this.loading = false
        }, 100)
      })
    }
  }
}
// const debounce = (func, delay) => {
//   let debounceTimer
//   return function() {
//     const context = this
//     const args = arguments
//     clearTimeout(debounceTimer)
//     debounceTimer
//       = setTimeout(() => func.apply(context, args), delay)
//   }
// }
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
