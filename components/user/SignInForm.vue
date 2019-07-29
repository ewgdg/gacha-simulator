<template>
  <div>
    <div v-b-modal.modalsignin>
      <slot></slot>
    </div>
    <b-modal
      id="modalsignin"
      ref="modalsignin"
      hide-header
      hide-footer
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form>
        <div class="form-group">
          <label for="inputUserName_signin">User name</label>
          <input
            id="inputUserName_signin"
            v-model="username"
            type="username"
            class="form-control"
            aria-describedby="inputUserName"
            placeholder="Enter user name"
          />
        </div>
        <div class="form-group">
          <label for="InputPassword_signin">PIN</label>
          <input
            id="InputPassword_signin"
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
      this.$auth
        .signInWithEmailAndPassword(
          this.username + process.env.authPostfix,
          this.password + process.env.authPostfix
        )
        .then(() => {
          this.$nextTick(() => {
            this.$refs.modalsignin.hide()
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    gotoSignUpPage() {
      this.$refs.modalsignin.hide()
      this.$router.push({
        path: '/signup',
        query: { username: this.username, password: this.password }
      })
    }
  }
}
</script>

<style scoped></style>
