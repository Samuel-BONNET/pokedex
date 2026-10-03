<template>
  <section class="relative flex w-full min-h-screen overflow-hidden">
    <div class="wallpaper" :style="{ backgroundImage: `url('${img.remote.loginWallpaper}')` }" />
    <NuxtLink to="/" class="absolute m-2 top-0 right-0 flex items-center text-transparent hover:text-black">{{text.login.hub}}<img src="/favicon.ico" class="max-w-8 m-2" /></NuxtLink>

    <div class="relative z-10 w-3/5 h-screen rounded-r-4xl p-2 drop-shadow-2xl shadow-2xl overflow-hidden bg-white">
      <div class="image-stage h-full">
        <img :src="img.remote.loginPanel.login"
          :alt="text.alt.login"
          class="image-layer w-full h-full object-cover rounded-r-4xl object-[30%_50%]"
          :class="{ 'is-active': mode === 'login' }" />
        <img :src="img.remote.loginPanel.register"
          :alt="text.alt.register"
          class="image-layer w-full h-full object-cover rounded-r-4xl object-[30%_50%]"
          :class="{ 'is-active': mode === 'register' }" />
      </div>
    </div>

    <div class="w-2/5 h-screen flex items-center justify-center p-8 overflow-hidden" :class="{ 'order-1': mode === 'register' }">
      <div class="stage">
        <div class="panel panel-login" :class="{ 'is-active': mode === 'login' }">
          <div class="panel-inner">
            <form @submit.prevent="login" class="auth-card">
              <h2 class="text-2xl text-center mb-4 font-bold text-green-600">{{ text.login.connexion.toUpperCase() }}</h2>
              <input v-model="email" :placeholder="text.login.email" type="email" name="email" autocomplete="email" class="field-input" />
              <input v-model="password" :placeholder="text.login.password" type="password" name="password" autocomplete="current-password" class="field-input" />

                <div>
                  <a class="flex flex-row justify-center cursor-pointer" @click.prevent="guestLogin" >
                    <p class="mx-2 text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center">{{ text.login.guest }}</p>
                    <img class="h-10 w-10 object-contain rounded-full border-2 border-blue-400 bg-blue-200" :src="img.avatar.guest" :alt="text.alt.guest" />
                  </a>
                </div>

                <a href="#" class="text-sm text-green-600 hover:text-slate-600 text-center block mt-2">{{ text.login.forgotPassword }}</a>
              <button type="submit" class="mt-4 w-full bg-green-600 hover:text-green-200 hover:bg-green-700 text-white rounded-lg py-2 cursor-pointer">{{ text.login.connexion }}</button>
              <button type="button" class="mt-3 text-sm text-slate-500 hover:text-green-600 transition-colors cursor-pointer" @click="mode = 'register'">
                {{ text.login.createAccount }}
              </button>
            </form>
          </div>
        </div>

        <div class="panel panel-register" :class="{ 'is-active': mode === 'register' }">
          <div class="panel-inner">
            <form @submit.prevent="register" class="auth-card">
            <h2 class="text-2xl text-center mb-4 font-bold text-green-600">{{ text.login.inscription.toUpperCase() }}</h2>
            <input v-model="regEmail" type="email" name="email" autocomplete="email" :placeholder="text.login.email" class="field-input" />
            <input v-model="regPseudo" type="text" name="pseudo" autocomplete="nickname" :placeholder="text.login.pseudo" class="field-input" />
            <input v-model="regPassword" type="password" name="password" autocomplete="new-password" :placeholder="text.login.passwordFr" class="field-input" />
            <input v-model="regPasswordConfirmation" type="password" name="passwordConfirmation" autocomplete="new-password" :placeholder="text.login.passwordConfirmation" class="field-input" />
            <input v-model="regSecretToken" type="password" name="secretToken" :placeholder="text.login.secretToken" class="field-input" />
            <button type="submit" class="mt-4 w-full bg-green-600 text-white hover:text-green-200 hover:bg-green-700 rounded-lg py-2 cursor-pointer">{{ text.login.inscription }}</button>
            <button type="button" class="mt-3 text-sm text-slate-500 hover:text-green-600 transition-colors cursor-pointer" @click="mode = 'login'">
              {{ text.login.alreadyMember }}
            </button>
            <p v-if="regError" class="text-red-500 text-center mt-2">{{ regError }}</p>
          </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { img, text } = useLang()

const route = useRoute()

const mode = ref<'login' | 'register'>(route.query.mode === 'register' ? 'register' : 'login')

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

const regEmail = ref('');
const regPseudo = ref('');
const regPassword = ref('');
const regPasswordConfirmation = ref('');
const regSecretToken = ref('');
const regError = ref<string | null>(null);

const { login: authLogin, setGuest } = useAuth();

function guestLogin() {
  setGuest()
}

async function login() {
  error.value = null
  try {
    await authLogin(email.value, password.value)
  } catch (e: any) {
    error.value = e?.data?.message ?? text.login.loginFailed
    return
  }
  navigateTo('/')
}

async function register() {
  regError.value = null
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: regEmail.value,
        pseudo: regPseudo.value,
        password: regPassword.value,
        passwordConfirmation: regPasswordConfirmation.value,
        secretToken: regSecretToken.value,
      },
    })
    mode.value = 'login'
  } catch (e: any) {
    regError.value = e?.data?.message ?? text.login.registerFailed
  }
}


</script>

<style scoped>
.wallpaper {
  position: absolute;
  inset: -5%;
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  transform: scale(1.05);
}


.auth-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.75rem 1.5rem;
  border-radius: 1.25rem;
  border: 4px solid rgb(255 255 255 / 0.6);
  background: rgb(255 255 255 / 0.30);
  backdrop-filter: blur(12px);
  box-shadow: 0 22px 50px -22px rgb(15 23 42 / 0.45);
}

.field-input {
  width: 100%;
  margin: 0.25rem 0;
  padding: 0.6rem 0.9rem;
  border-radius: 0.7rem;
  border: 1px solid rgb(148 163 184 / 0.5);
  background: rgb(248 250 252 / 0.9);
  color: rgb(15 23 42 / 1);
  font-size: 0.95rem;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.field-input::placeholder {
  color: rgb(100 116 139 / 0.7);
}

.field-input:hover {
  border-color: rgb(100 116 139 / 0.7);
}

.field-input:focus {
  outline: none;
  background: #fff;
  border-color: rgb(16 185 129 / 1);
  box-shadow: 0 0 0 3px rgb(16 185 129 / 0.18);
}

.image-stage {
  position: relative;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-layer {
  grid-area: 1 / 1;
  min-width: 0;
  min-height: 0;
  opacity: 0;
  transform: scale(1.08);
  filter: blur(8px);
  transition: opacity 0.6s ease, transform 0.8s ease, filter 0.6s ease;
  will-change: opacity, transform;
}

.image-layer.is-active {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.stage {
  position: relative;
  display: grid;
  overflow: hidden;
  width: 100%;
  max-width: 440px;
}

.panel {
  grid-area: 1 / 1;
  transition: transform 0.55s ease, opacity 0.55s ease;
  pointer-events: none;
}

.panel.is-active {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
  z-index: 1;
}

.panel:not(.is-active) {
  transform: translateX(100%);
  opacity: 0;
}

.panel-inner {
  display: flex;
  justify-content: center;
}

</style>