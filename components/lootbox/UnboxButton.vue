<template>
  <div>
    <!--    <button @click="nextDraw">next</button>-->
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
    <!--    error message-->
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

    <!--    other buttons-->
    <div class="d-flex justify-content-center my-2">
      <div
        class="d-flex flex-column btn-div mx-2 clickable"
        @click="generateResult(1)"
      >
        <div class="btn-upper rounded-top">
          <div
            style="height: 100%"
            class="d-flex flex-row justify-content-center"
          >
            <span class="icon-text">600</span>
            <img :src="gemstoneIcon" alt="icon" class="icon" />
          </div>
        </div>
        <div class="btn-lower rounded-bottom">Single Draw</div>
      </div>
      <div
        class="d-flex flex-column btn-div mx-2 clickable"
        @click="generateResult(10)"
      >
        <div class="btn-upper rounded-top">
          <div
            style="height: 100%"
            class="d-flex flex-row justify-content-center"
          >
            <span class="icon-text">6000</span>
            <img :src="gemstoneIcon" alt="icon" class="icon" />
          </div>
        </div>
        <div class="btn-lower rounded-bottom">Ten Times</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, maxValue, minValue, integer } from 'vuelidate/lib/validators'
// import UnboxResult from '~/components/lootbox/UnboxResult.vue'
// import UnboxSummary from '~/components/lootbox/UnboxCollection.vue'

export default {
  name: 'UnboxView',
  components: {
    // UnboxResult
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
    },
    gemstoneIcon(){
      return require(process.env.gemstoneUrl);
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

  .btn-upper{
    width: 100%;
    height: 1rem;
    background-color: rgba(39,39,45,0.5);
    text-align: center;
    color: white;
    margin: 0;
    padding: 0;
    font-size: 0px;
  }
  .btn-lower{
    width: 100%;
    height: 2rem;
    background-color: gold;
    text-align: center;
    line-height: 2rem;
    /*color: white;*/
  }
  .btn-div{
    width: 6rem;
    max-width: 100%;
  }

  .icon-text{
    font-family: initial;
    font-size: 1rem;
    line-height: 1rem;
    display: inline;
  }
  .icon{
    max-height: 100%;
    display: inline;


    padding: 0px;
    margin: 0px;
  }


</style>
