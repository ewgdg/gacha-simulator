<template>
  <div>
    <b-button v-b-modal.modal>Launch demo modal</b-button>
    <b-modal
      id="modal"
      ref="modal"
      hide-header
      hide-footer
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form>
        <div class="form-group">
          <label for="inputUserName">User name</label>
          <input
            id="inputUserName"
            v-model="username"
            type="username"
            class="form-control"
            aria-describedby="inputUserName"
            placeholder="Enter user name"
          />
        </div>
        <div class="form-group">
          <label for="InputPassword">PIN</label>
          <input
            id="InputPassword"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter 4-digit PIN"
          />
        </div>
        <div class="d-flex  w-100">
          <div class="ml-auto">
            <button
              type="submit"
              class="btn btn-primary"
              @click.prevent="handleSubmit()"
            >
              Login
            </button>
            <button class="btn btn-primary" @click.prevent="gotoSignUpPage()">
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'SignInForm',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    resetModal() {
      this.username = ''
      this.password = ''
    },
    handleOk(e) {
      // Prevent modal from closing
      e.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      // if (!this.checkFormValidity()) {
      //   return
      // }
      // Push the name to submitted names
      // this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$refs.modal.hide()
      })
    },
    gotoSignUpPage() {
      this.$refs.modal.hide()
      this.$router.push({
        path: '/signup',
        query: { username: this.username, password: this.password }
      })
    }
  }
}
</script>

<style scoped></style>
