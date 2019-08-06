<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center"
    style="height: 50vh"
  >
    <b-button
      variant="success"
      :disabled="currentNumber > 0"
      class="mb-2"
      @click="startGame()"
    >
      <span>
        Start Game
      </span>
    </b-button>
    <div>
      <div class="d-flex align-items-center justify-content-center border">
        <b-form-group class="text-center mb-0 pb-0">
          <span>Select a difficulty:</span>
          <div class="d-flex flex-row justify-content-center m-1">
            <b-form-radio
              id="easy"
              v-model="difficulty"
              name="difficulty-radios"
              value="easy"
              class="mr-2"
            >
              Easy
              <span
                v-b-tooltip.hover
                class="text-info"
                title="In easy mode, your score will not be uploaded. Massive chive players will be generated."
              >
                (?)
              </span>
            </b-form-radio>
            <b-form-radio
              id="difficult"
              v-model="difficulty"
              name="difficulty-radios"
              value="difficult"
              class="mr-0"
            >
              Hell
              <span
                v-b-tooltip.hover
                class="text-info"
                title="Your score will be uploaded for ranking. Majority of generated players are free rider."
              >
                (?)
              </span>
            </b-form-radio>
          </div>
        </b-form-group>
      </div>
    </div>
    <b-progress
      v-if="currentNumber > 0"
      :value="currentNumber"
      :max="maxNumber"
      :show-progress="true"
      animated
      :precision="1"
      class="w-75 m-2"
    ></b-progress>
  </div>
</template>

<script>
export default {
  name: 'StartGameButton',
  data() {
    return {
      difficulty: 'difficult',
      currentNumber: 0
    }
  },
  computed: {
    maxNumber() {
      return this.$store.state.maxProgressValue
    },
    currentProgress() {
      return this.$store.state.progress
    },
    progressInterval() {
      return this.maxNumber / 33
    }
  },
  watch: {
    currentProgress(to, from) {
      // it seems that the bootstrap-vue progress bar debounce the animation
      // so we need to slow down the progress to allow the animation
      if (
        this.currentNumber < to - this.progressInterval ||
        to >= this.maxNumber
      ) {
        this.currentNumber = to
      }
    }
  },
  methods: {
    startGame() {
      this.$store.dispatch('startGame', this.difficulty)
    }
  }
}
</script>

<style scoped>
.uiButton {
  position: fixed;
  top: 0;
  right: 0;
}
</style>
