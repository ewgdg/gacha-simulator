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
        <div style="min-height: 1.5em">
          <div v-if="error" class="text-danger shaking">
            Authentication failed. Try again.
          </div>
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
    <template v-if="loading">
      <LoadingSpinner></LoadingSpinner>
      <Blocker></Blocker>
    </template>
  </div>
</template>

<script>
import Blocker from '~/components/ui/Blocker'
import LoadingSpinner from '~/components/ui/LoadingSpinner'

export default {
  name: 'SignInForm',
  components: {
    Blocker: Blocker,
    LoadingSpinner: LoadingSpinner
  },
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      error: false
    }
  },
  methods: {
    resetModal() {
      this.username = ''
      this.password = ''
      this.loading = false
      this.error = false
    },
    handleOk(e) {
      // Prevent modal from closing
      e.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      this.loading = true
      this.error = false
      this.$auth
        .signInWithEmailAndPassword(
          this.username + process.env.authPostfix,
          this.password + process.env.authPostfix
        )
        .then(() => {
          this.$nextTick(() => {
            this.$refs.modalsignin.hide()
            if (!['/', '/play', 'guide'].includes(this.$route.path)) {
              this.loading = false
              this.$router.push('/')
            }
          })
        })
        .catch((error) => {
          this.loading = false
          this.error = true
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
