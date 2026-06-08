<template>

  <form @submit.prevent="register">
    <input v-model="email" type="email" name="email" placeholder="Email" />
    <input v-model="pseudo" type="text" name="pseudo" placeholder="Pseudo" />
    <input v-model="password" type="password" name="password" placeholder="Password" />
    <input v-model="passwordConfirmation" type="password" name="passwordConfirmation" placeholder="Confirmation" />
    <input v-model="secretToken" type="password" name="secretToken" placeholder="Secret Token" />
    <button type="submit">Register</button>
  </form>
  <p v-if="error">
    {{ error }}
  </p>

</template>

<style scoped>

</style>

<script setup lang="ts">

const email = ref('');
const pseudo = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const secretToken = ref('');
const error = ref<string | null>(null);

async function register() {
  error.value = null

  try{
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        pseudo: pseudo.value,
        password: password.value,
        passwordConfirmation: passwordConfirmation.value,
        secretToken: secretToken.value }
    })
    await navigateTo('/login')
  } catch(e: any){
    error.value = e?.data?.message ?? 'Register Failed'
  }
}

</script>
