<template>
  <div>
    <b-button v-b-modal.topup>Open Modal</b-button>

    <b-modal
      id="topup"
      ref="modal"
      title="Top up"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
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

      <div class="input-group mt-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Amount</span>
        </div>
        <input
          v-model="amount"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': $v.amount.$error, shaking: $v.amount.$error }"
          @input="$v.amount.$touch"
        />
        <div class="input-group-append">
          <div class="input-group-text p-0">
            <img :src="gemstoneIcon" alt="icon" />
          </div>
        </div>
      </div>

      <div v-if="!$v.amount.required" class="error">This field is required</div>
      <div v-else-if="!$v.amount.integer" class="error">
        Amount must be an integer
      </div>
      <div v-else-if="!$v.amount.minValue" class="error">
        Amount cannot be negative
      </div>
      <div v-else-if="!$v.amount.maxValue" class="error">
        Your balance cannot exceed {{ MAX_AMOUNT }}
      </div>

      <div slot="modal-footer">
        <button class="btn btn-secondary" @click="resetModal">Cancel</button>
        <button
          class="btn btn-primary"
          :disabled="$v.amount.$error"
          @click="handleOk"
        >
          Submit
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { required, integer, minValue, maxValue } from 'vuelidate/lib/validators'
const MAX_AMOUNT = 99999
export default {
  name: 'TopUpModal',
  data() {
    return {
      amount: 0,
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
    }
  },
  methods: {
    handleOk() {
      this.hide_modal()
    },
    resetModal() {
      this.hide_modal()
      this.amount = 0
      // this.$nextTick(() => {
      //   this.amount = 0
      // })
    },
    hide_modal() {
      this.$refs.modal.hide()
    }
  },
  validations() {
    return {
      amount: {
        required: required,
        integer: integer,
        minValue: minValue(0),
        maxValue: maxValue(
          Math.max(
            0,
            MAX_AMOUNT - this.$store.getters['modules/funds/getBalance']
          )
        )
      }
    }
  }
}
</script>

<style scoped>
.icon {
  width: 2rem;
}

.error {
  display: block;
  color: #f57f6c;
}

.form-group__message,
.error {
  font-size: 0.75rem;
  line-height: 1;
  text-align: center;
  margin-top: 0.5rem;
}
</style>
