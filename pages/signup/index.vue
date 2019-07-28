<template>
  <div>
    <SignInForm></SignInForm>
    <SignUpForm></SignUpForm>
  </div>
</template>

<script>
import SignInForm from '~/components/user/SignInForm'
import SignUpForm from '~/components/user/SignUpForm'
export default {
  name: 'Index',
  components: {
    SignInForm: SignInForm,
    SignUpForm: SignUpForm
  }
}
</script>

<style scoped></style>
