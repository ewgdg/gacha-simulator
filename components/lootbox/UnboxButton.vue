<template>
  <div>
    <!--    other buttons-->
    <div class="d-flex justify-content-center my-2">
      <div
        class="d-flex flex-column btn-div mx-2 clickable"
        @click="drawCard(1)"
      >
        <div class="btn-upper rounded-top">
          <div
            style="height: 100%"
            class="d-flex flex-row justify-content-center"
          >
            <span class="icon-text">{{ getCost(1) }}</span>
            <img :src="gemstoneIcon" alt="icon" class="icon" />
          </div>
        </div>
        <div class="btn-lower rounded-bottom">Single Draw</div>
      </div>
      <div
        class="d-flex flex-column btn-div mx-2 clickable"
        @click="drawCard(10)"
      >
        <div class="btn-upper rounded-top">
          <div
            style="height: 100%"
            class="d-flex flex-row justify-content-center"
          >
            <span class="icon-text">{{ getCost(10) }}</span>
            <img :src="gemstoneIcon" alt="icon" class="icon" />
          </div>
        </div>
        <div class="btn-lower rounded-bottom">Ten Times</div>
      </div>
      <b-form-checkbox
        id="checkbox-1"
        v-model="isAuto"
        name="checkbox-1"
        value="true"
        unchecked-value="false"
      >
        Auto
        <span
          v-b-tooltip.hover
          class="text-info"
          title="Automatically and continuously press the button you first press after checking this option until out of balance"
          >(?)</span
        >
      </b-form-checkbox>
    </div>
    <InsufficientFundsModal ref="modal"></InsufficientFundsModal>
    <template v-if="loading">
      <Blocker></Blocker>
      <LoadingSpinner></LoadingSpinner>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, maxValue, minValue, integer } from 'vuelidate/lib/validators'
// import UnboxResult from '~/components/lootbox/UnboxResult.vue'
// import UnboxSummary from '~/components/lootbox/UnboxCollection.vue'
import InsufficientFundsModal from '~/components/funds/InsufficientFundsModal.vue'
import Blocker from '~/components/ui/Blocker'
import LoadingSpinner from '~/components/ui/LoadingSpinner'

export default {
  name: 'UnboxView',
  components: {
    // UnboxResult
    // UnboxSummary
    InsufficientFundsModal: InsufficientFundsModal,
    Blocker: Blocker,
    LoadingSpinner: LoadingSpinner
  },
  data() {
    return {
      frequencyPerDraw: 1,
      clicked: false,
      loading: false,
      isAuto: 'false'
    }
  },
  computed: {
    form_valid() {
      return {
        'is-valid': !this.$v.frequencyPerDraw.$error,
        'is-invalid': this.$v.frequencyPerDraw.$error
      }
    },
    gemstoneIcon() {
      return require(process.env.gemstoneUrl)
    },
    ...mapGetters('modules/playerAgents', {
      getBalance: 'getBalance'
    }),
    balance() {
      return this.getBalance()
    }
  },

  methods: {
    ...mapActions({
      generateResult: 'modules/lootboxResult/generateResult'
    }),
    showInsufficientFundsModal() {
      this.$refs.modal.showModal()
    },
    checkBalance(cost) {
      return this.balance >= cost
    },
    getCost(count) {
      return count * process.env.cardCost
    },
    async drawCard(count) {
      let done = false
      while (!done) {
        const cost = this.getCost(count)
        if (!this.checkBalance(cost)) {
          this.showInsufficientFundsModal()
          done = true
          return
        } else {
          if (this.isAuto !== 'true') {
            this.loading = true
          }
          await this.generateResult(count)
        }
        await this.$waitForAnimation()
        if (this.isAuto !== 'true' && this.loading === true) {
          await new Promise((resolve) => {
            setTimeout(() => {
              this.loading = false
              resolve()
            }, 100)
          })
          done = true
        } else {
          await this.$wait(1000 + count * 75)
          if (this.isAuto !== 'true') {
            done = true
          }
        }
      }
    }
  },

  validations: {
    frequencyPerDraw: {
      required,
      maxValue: maxValue(10),
      minValue: minValue(1),
      integer
    }
  }
}
</script>

<style scoped>
.btn-scoped:hover {
  background-color: rgba(19, 117, 250, 0.51);
}

.btn-scoped:active {
  background-color: #1375fa;
  transform: scale(0.9);
}
span {
  display: inline-block;
}

.btn-upper {
  width: 100%;
  height: 1rem;
  background-color: rgba(39, 39, 45, 0.5);
  text-align: center;
  color: white;
  margin: 0;
  padding: 0;
  /*font-size: 0px;*/
}
.btn-lower {
  width: 100%;
  height: 2rem;
  background-color: gold;
  text-align: center;
  line-height: 2rem;
  /*color: white;*/
}
.btn-div {
  width: 6rem;
  max-width: 100%;
}

.icon-text {
  font-family: initial;
  font-size: 1rem;
  line-height: 1rem;
  display: inline;
}
.icon {
  max-height: 100%;
  display: inline;

  padding: 0px;
  margin: 0px;
}
</style>
