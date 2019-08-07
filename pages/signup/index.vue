<template>
  <div>
    <SignUpForm></SignUpForm>
  </div>
</template>

<script>
import SignUpForm from '~/components/user/SignUpForm'
export default {
  name: 'Index',
  components: {
    SignUpForm: SignUpForm
  }
}
</script>

<style scoped></style>
