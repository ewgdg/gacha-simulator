<template>
  <div>
    <SignUpForm></SignUpForm>
    <button @click="test">test</button>
  </div>
</template>

<script>
import SignUpForm from '~/components/user/SignUpForm'
export default {
  name: 'Index',
  components: {
    SignUpForm: SignUpForm
  },
  methods: {
    test() {
      this.$functions.useFunctionsEmulator('http://localhost:5001')
      this.$functions
        .httpsCallable('uploadScore')({})
        .then((data) => {
          console.log('data')
          console.log(data)
        })
        .catch((e) => {
          console.log(e)
        })
    }
    // test() {
    //   this.$auth
    //     .fetchSignInMethodsForEmail('ggg@gacha.simulator')
    //     .then((res) => {
    //       console.log(res)
    //     })
    // }
  }
}
</script>

<style scoped></style>
