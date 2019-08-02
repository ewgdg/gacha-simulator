<template>
  <div>
    <!--    <div v-if="!$store.state.user" v-b-modal.modalsignin>-->
    <!--      <slot></slot>-->
    <!--    </div>-->
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
        <div style="min-height: 1.5em">
          <div v-if="error" class="text-danger shaking">
            Authentication failed. Try again.
          </div>
        </div>
        <div class="d-flex  w-100">
          <div class="ml-auto">
            <button class="btn btn-primary" @click.prevent="handleSubmit()">
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
      password: '',
      error: false
    }
  },
  methods: {
    resetModal() {
      this.username = ''
      this.password = ''
      this.error = false
    },
    handleOk(e) {
      // Prevent modal from closing
      e.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // console.log(this.$eventBus)
      this.$eventBus.$emit('block')
      this.error = false

      return this.$auth
        .signInWithEmailAndPassword(
          this.username + process.env.authPostfix,
          this.password + process.env.authPostfix
        )
        .then(() => {
          this.$eventBus.$emit('unblock')
          this.$nextTick(() => {
            this.$refs.modalsignin.hide()
            if (!['/', '/play', 'guide'].includes(this.$route.path)) {
              let to = '/'
              if (this.$route.query) {
                to = this.$route.query.from
              }
              this.$router.push(to)
            }
          })
        })
        .catch((error) => {
          this.error = true
          console.log(error)
          this.$eventBus.$emit('unblock')
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
