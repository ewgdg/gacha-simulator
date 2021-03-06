<template>
  <div v-if="gameStatus">
    <span @click="show_modal()">
      <slot> </slot>
    </span>

    <b-modal
      id="topupOnly"
      ref="shopModal"
      title="Gemstone Modifier v1"
      @show="resetModal()"
      @hidden="hide_modal()"
      @ok="handleOk()"
    >
      <div>
        <p>
          Please choose a gemstone modifier:
          <a v-b-tooltip href="#" title="This will not affect anything.">(?)</a>
        </p>

        <div>
          <div class="form-check form-check-inline">
            <input
              id="inlineRadio1"
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              value="option1"
              checked
            />
            <label class="form-check-label" for="inlineRadio1"
              >Green Modifier
              <img :src="greenModifierIcon" alt="icon" class="icon" />
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              id="inlineRadio2"
              class="form-check-input"
              type="radio"
              name="inlineRadioOptions"
              value="option2"
            />
            <label class="form-check-label" for="inlineRadio2"
              >Blue Modifier
              <img :src="blueModifierIcon" alt="icon" class="icon" />
            </label>
          </div>
        </div>
      </div>

      <p class="mt-3 mb-0">
        <span>Choose quantity of gemstones to add:</span>
      </p>
      <div class="container-fluid">
        <div class="row justify-content-around">
          <price-tag
            :price="84"
            :gem-quantity="priceToQuantity(84)"
            class="col-3"
            @click="addQuantity(priceToQuantity(84))"
          ></price-tag>
          <price-tag
            :price="168"
            :gem-quantity="priceToQuantity(168)"
            class="col-3"
            @click="addQuantity(priceToQuantity(168))"
          ></price-tag>
          <price-tag
            :price="328"
            :gem-quantity="priceToQuantity(328)"
            class="col-3"
            @click="addQuantity(priceToQuantity(328))"
          ></price-tag>
          <price-tag
            :price="648"
            :gem-quantity="priceToQuantity(648)"
            class="col-3"
            @click="addQuantity(priceToQuantity(648))"
          ></price-tag>
        </div>
      </div>
      <div class="input-group mt-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Quantity</span>
        </div>
        <input
          v-model="quantity"
          type="search"
          class="form-control"
          :class="{
            'error-border': $v.quantity.$invalid,
            shaking: $v.quantity.$invalid
          }"
          @input="$v.quantity.$touch()"
        />
        <div class="input-group-append">
          <div class="input-group-text p-0">
            <img :src="gemstoneIcon" alt="icon" />
          </div>
        </div>
      </div>

      <template v-if="$v.$dirty">
        <div v-if="!$v.quantity.required" class="error">
          This field is required
        </div>
        <div v-else-if="!$v.quantity.integer" class="error">
          Amount must be an integer
        </div>
        <div v-else-if="!$v.quantity.minValue" class="error">
          Amount cannot be negative
        </div>
        <div v-else-if="!$v.quantity.maxValue" class="error">
          Your balance cannot exceed {{ MAX_AMOUNT }}
        </div>
      </template>

      <div slot="modal-footer">
        <p>
          Total Price:
          <span class="font-italic font-weight-bold">${{ price }} </span>
        </p>
        <button class="btn btn-secondary" @click="hide_modal()">Cancel</button>
        <button
          class="btn btn-primary"
          :disabled="$v.quantity.$invalid"
          @click="handleOk()"
        >
          Submit
        </button>
      </div>
    </b-modal>

    <!--    success modal-->
    <b-modal
      ref="successModal"
      header-bg-variant="success"
      header-text-variant="light"
      size="sm"
      title="Congratulation!"
      ok-only
      no-stacking
    >
      Your transaction is completed.
    </b-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, integer, minValue, maxValue } from 'vuelidate/lib/validators'
import PriceTag from '~/components/funds/PriceTag'
const MAX_AMOUNT = 1000000

export default {
  name: 'TopUpModal',
  components: {
    PriceTag: PriceTag
  },
  data() {
    return {
      quantity: 0,
      MAX_AMOUNT: MAX_AMOUNT
    }
  },
  computed: {
    greenModifierIcon() {
      return require(process.env.greenModifierUrl)
    },
    blueModifierIcon() {
      return require(process.env.blueModifierUrl)
    },
    gemstoneIcon() {
      return require(process.env.gemstoneUrl)
    },
    price648Icon() {
      return require(process.env.price648iconUrl)
    },
    price168Icon() {
      return require(process.env.price168iconUrl)
    },
    price() {
      return this.quantity / process.env.gemUnitQuantity
    },
    gameStatus() {
      return this.$store.state.gameStatus
    },
    getBalance() {
      return this.$store.getters['modules/playerAgents/getBalance']
    },
    balance() {
      if (!this.gameStatus) {
        return 0
      }
      return this.getBalance('player1')
    }
  },
  watch: {
    quantity: function(to, from) {
      this.$v.quantity.$touch()
      if (to === undefined || to === '' || to === null || String(to) === '') {
        this.quantity = 0
      } else {
        this.quantity = parseInt(to)
      }
    }
  },
  created() {
    this.$eventBus.$on('shop', this.show_modal)
  },
  methods: {
    async handleOk() {
      this.$v.$reset()
      await this.$nextTick()
      this.hide_modal()
      await this.$nextTick()
      if (this.price > 0) {
        await this.purchaseGemstone(this.price)
        this.showSuccessModal()
      }
    },
    resetModal() {
      // this.hide_modal()
      this.quantity = 0
    },
    hide_modal() {
      this.$refs.shopModal.hide()
    },

    show_modal() {
      this.$refs.shopModal.show()
    },
    hideSuccessModal() {
      this.$refs.successModal.hide()
    },
    showSuccessModal() {
      this.$refs.successModal.show()
    },
    ...mapActions('modules/playerAgents', {
      topup: 'agentTopup'
    }),
    async purchaseGemstone(price) {
      await this.topup({
        name: 'player1',
        amount: parseFloat(price)
      })
    },
    addQuantity(number) {
      this.quantity = parseInt(this.quantity) + parseInt(number)
    },
    priceToQuantity(price) {
      return price * process.env.gemUnitQuantity
    }
  },
  validations() {
    return {
      quantity: {
        required: required,
        integer: integer,
        minValue: minValue(0),
        maxValue: maxValue(Math.max(0, MAX_AMOUNT - this.balance))
      }
    }
  }
}
</script>

<style scoped>
.icon {
  width: 2rem;
}
.error-border {
  border-style: solid !important;
  border-radius: 4px !important;
  border-color: red !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 121, 129, 0.57) !important;
}
</style>
