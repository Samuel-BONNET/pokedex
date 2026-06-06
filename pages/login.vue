<template>
  <form @submit.prevent="login" >
    <h1>Login</h1>
    <input v-model="email" placeholder="email" type="email" name="email">
    <input v-model="password" placeholder="password" type="password" name="password">
    <a href="#">Mot de passe oublié</a>
    <button type="submit">Connexion</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>

<style scoped>

</style>

<script setup lang="ts">
const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

async function login() {
  error.value = null

  try{
    const res =  await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value }
    })
    console.log('TOKEN:', res)
    localStorage.setItem('token', (res as any).token)

    await navigateTo('/hub')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Login Failed'
  }
}
</script>