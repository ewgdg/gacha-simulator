<template>
  <div>
    <b-modal
      id="insufficientFund"
      ref="modal"
      size="md"
      title="Insufficient Gemstone"
      header-bg-variant="warning"
      @hidden="hideModal()"
      @ok="handleOk()"
    >
      <div>
        <p>
          There is no enough balance.
        </p>
      </div>

      <div slot="modal-footer">
        <span>Add more gemstones?</span>
        <button class="btn btn-secondary" @click="hideModal()">No</button>
        <button class="btn btn-primary" @click="handleOk()">
          Yes
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'InsufficientFundModal',
  methods: {
    showModal() {
      this.$refs.modal.show()
    },
    hideModal() {
      this.$refs.modal.hide()
    },
    handleOk() {
      this.hideModal()
      this.$eventBus.$emit('shop')
    }
  }
}
</script>

<style scoped></style>
