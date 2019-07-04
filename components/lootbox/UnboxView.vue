<template>
  <div>
    <button @click="nextDraw">next</button>
    <div class="input-group w-50 mx-auto">
      <div class="input-group-prepend">
        <span class="input-group-text">Frequency</span>
      </div>
      <input
        v-model="frequencyPerDraw"
        class="form-control"
        placeholder="Type frequency from 1 to 10"
        type="text"
        :class="form_valid"
        @input="$v.frequencyPerDraw.$touch"
      />
      <div class="input-group-append">
        <button
          type="button"
          class="btn btn-outline-primary btn-scoped"
          :disabled="$v.frequencyPerDraw.$error"
          @click="generateResult(frequencyPerDraw)"
        >
          Draw
          <small>(cost: {{ frequencyPerDraw * 600 }} )</small>
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <p
        style="display: inline-block"
        class="font-italic mx-auto mb-0 text-warning"
      >
        <transition enter-active-class="shaking">
          <span v-if="$v.frequencyPerDraw.$error">
            The number should be ranged from 1 to 10
          </span>
        </transition>
      </p>
    </div>

    <UnboxResult />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, maxValue, minValue, integer } from 'vuelidate/lib/validators'
import UnboxResult from '~/components/lootbox/UnboxResult.vue'
// import UnboxSummary from '~/components/lootbox/UnboxCollection.vue'

export default {
  name: 'UnboxView',
  components: {
    UnboxResult
    // UnboxSummary
  },
  data() {
    return {
      frequencyPerDraw: 1,
      clicked: false
    }
  },
  methods: {
    ...mapActions({
      generateResult: 'modules/lootboxResult/generateResult',
      initData: 'modules/cards/assignWeights',
      nextDraw: 'modules/lootboxResult/nextDraw'
    }),
    delay() {
      /* eslint-disable */
      console.log('up')
      setTimeout(() => {
        this.clicked = false
        console.log(this.clicked)
      }, 1000)
    }
  },
  computed:{
    form_valid() {
      return {
        'is-valid': !this.$v.frequencyPerDraw.$error,
        'is-invalid': this.$v.frequencyPerDraw.$error
      }
    }
  },

  validations:{
    frequencyPerDraw: {
      required,
      maxValue:maxValue(10),
      minValue:minValue(1),
      integer
    }
  }
}
</script>


<style scoped>
  .btn-scoped:hover{
    background-color: rgba(19,117,250,0.51)
  }

  .btn-scoped:active{
    background-color: #1375fa;
    transform: scale(0.9);
  }
   span{
     display: inline-block;
   }

</style>
