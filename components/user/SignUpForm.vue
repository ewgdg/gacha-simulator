<template>
  <div>
    <template v-if="registering">
      <LoadingSpinner></LoadingSpinner>
      <Blocker></Blocker>
    </template>
    <form>
      <p v-if="server_error" class="text-danger">
        There is an error from the server. Please try again.
      </p>
      <div class="form-group">
        <label for="inputUserName">User name</label>
        <input
          id="inputUserName"
          :value="username"
          type="username"
          class="form-control"
          aria-describedby="inputUserName"
          placeholder="Enter user name"
          @change="
            username = $event.target.value
            $v.username.$touch()
          "
        />
        <template v-if="$v.username.$dirty">
          <small v-if="!$v.username.format" class="text-danger">
            The name should contain letters and digits only.
          </small>
          <small v-else-if="!$v.username.maxLength" class="text-danger">
            The maximum length is 9.
          </small>
          <small v-else-if="checkingName || $v.username.$pending">
            <b-spinner
              style="width: 1rem; height: 1rem;"
              variant="primary"
            ></b-spinner>
            checking
          </small>
          <small v-else-if="!$v.username.unique" class="text-danger">
            The name has been taken.
          </small>
          <small v-else-if="$v.username.$dirty" class="text-success">
            This name is valid.
          </small>
        </template>
      </div>
      <div class="form-group">
        <label for="InputPassword">PIN</label>
        <input
          id="InputPassword"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter 4-digit PIN"
          @change="$v.password.$touch()"
        />
        <small v-if="$v.password.$error" class="error">
          PIN should be a 4-digit number
        </small>
      </div>
      <div class="form-group">
        <label for="InputPassword2">PIN verification</label>
        <input
          id="InputPassword2"
          v-model="password2"
          type="password"
          class="form-control"
          placeholder="Enter PIN again"
          @change="$v.password2.$touch()"
        />
        <small v-if="$v.password2.$error" class="error">
          The PIN does not match with previous one.
        </small>
      </div>
      <div class="d-flex  w-100">
        <div class="m-auto">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="$v.$invalid"
            @click.prevent="handleSubmit()"
          >
            submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators'
import LoadingSpinner from '~/components/ui/LoadingSpinner'
import Blocker from '~/components/ui/Blocker'
export default {
  name: 'SignUpForm',
  components: {
    LoadingSpinner: LoadingSpinner,
    Blocker: Blocker
  },
  data() {
    return {
      username: this.$route.query.username || '',
      password: this.$route.query.password || '',
      password2: '',
      checkingName: false,
      server_error: false,
      registering: false
    }
  },
  watch: {
    '$route.query'(to, from) {
      this.username = to.username
      this.password = to.password
      if (this.username) {
        this.$v.username.$touch()
      }
      if (this.password) {
        this.$v.password.$touch()
      }
    }
  },
  mounted() {
    if (this.username) {
      this.$v.username.$touch()
    }
    if (this.password) {
      this.$v.password.$touch()
    }
  },
  validations() {
    return {
      username: {
        required,
        format: (value) => {
          return /^[A-Za-z0-9]+$/.test(value)
        },
        maxLength: maxLength(9),
        unique: (value, vm) => {
          if (
            value === '' ||
            !this.$v.username.format ||
            !this.$v.username.maxLength
          )
            return true
          vm.checkingName = true
          // return new Promise((resolve, reject) => {
          //   setTimeout(() => {
          //     vm.checkingName = false
          //     resolve(true)
          //   }, 300)
          // })
          return this.checkUserNameDuplicate(value).then((isDuplicate) => {
            this.checkingName = false
            return !isDuplicate
          })
        }
      },
      password: {
        required,
        digit: (value) => {
          return /^[0-9]+$/.test(value)
        },
        len: (value) => {
          return value.length === 4
        }
      },
      password2: {
        required,
        matched: (value, vm) => {
          return value === vm.password
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      // this.$auth
      //   .createUserWithEmailAndPassword(email, password)
      //   .then((cred) => {
      //     return this.$db
      //       .collection('usernames')
      //       .doc(cred.user.uid)
      //       .set({
      //         username: this.username
      //       })
      //   })
      this.server_error = false
      this.registering = true
      if (!this.username || !this.password) return
      const email = this.username + process.env.authPostfix
      const password = this.password + process.env.authPostfix
      const createUser = this.$functions.httpsCallable('createUser')
      createUser({
        username: this.username,
        password: password,
        email: email
      })
        .then((result) => {
          this.$auth.signInWithEmailAndPassword(email, password)
        })
        .then(() => {
          this.registering = false
          this.$router.replace('/signup/success')
          this.$v.$reset()
          this.password = ''
          this.username = ''
        })
        .catch((error) => {
          console.log(error)
          this.registering = false
          this.server_error = true
          const temp = this.username
          this.username = ''
          this.username = temp
        })
    },
    checkUserNameDuplicate(name) {
      if (process.server) return Promise.resolve(false)
      // const db = this.$db
      // return db
      //   .collection('usernames')
      //   .where('username', '==', name)
      //   .limit(1)
      //   .get()
      //   .then((querySnapshot) => {
      //     // console.log(querySnapshot)
      //     return querySnapshot.size > 0
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     return true
      //   })

      return this.$auth
        .fetchSignInMethodsForEmail(name + process.env.authPostfix)
        .then((data) => {
          return data.length > 0
        })
        .catch((error) => {
          console.log(error)
          return true
        })
    }
  }
}
</script>

<style scoped></style>
