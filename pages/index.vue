<template>
  <div>
    <nav-bar />
    <ul>
      <li
        v-for="(val, key) in $store.state['modules']['cards'].card_info"
        :key="key"
      >
        {{ key }}: {{ val }}
      </li>
    </ul>

    <span v-for="i in 100" :key="i">
      {{ nextDraw() }}
    </span>
  </div>
</template>

<script>
import { weightedRandom } from '~/utilities/random'
import NavBar from '~/components/NavBar.vue'

export default {
  components: {
    NavBar
  },
  data() {
    return {
      drawed: ''
    }
  },
  methods: {
    log() {
      /* eslint-disable no-console */
      console.log(this.$store.dispatch('modules/cards/assignWeight'))
      console.log(this.$store.dispatch('modules/cards/generateCard'))
    },
    nextDraw() {
      const keys = Object.keys(this.$store.state.modules.cards.card_info)
      const values = Object.values(this.$store.state.modules.cards.card_info)
      return keys[weightedRandom(values)]
    }
  },
  created() {
    this.$store.dispatch('modules/cards/assignWeight')
  },
  computed: {
    getDraw() {
      this.nextDraw()
      return this.drawed
    },
    generateCard_computed() {
      // doesnt work bc of cache computed
      const keys = Object.keys(this.$store.state.modules.cards.card_info)
      const values = Object.values(this.$store.state.modules.cards.card_info)
      return keys[weightedRandom(values)]
      // return keys[weightedRandom(values)]
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
