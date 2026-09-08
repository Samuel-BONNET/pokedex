<template>
  <section class="flex flex-row items-center justify-center min-h-auto">
    <div class="w-full max-w-2xl rounded-2xl bg-white shadow-lg overflow-hidden">
      <div class="stage">
        <div class="panel panel-login" :class="{ 'is-active': mode === 'login' }">
          <div class="panel-inner">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWyHNCgCGuEzU6twdUIHgZtdvN_qiEFlXIIYqbIDfjtqdHN9X2oD8YBfKc&s=10" alt="Login" class="panel-img" />
            <form @submit.prevent="login" class="flex flex-col flex-1 items-center">
            <h2 class="text-2xl text-center mb-4">Connexion</h2>
            <input v-model="email" placeholder="Email" type="email" name="email" class="text-center m-1 border rounded-lg p-2 w-full" />
            <input v-model="password" placeholder="Password" type="password" name="password" class="text-center m-1 border rounded-lg p-2 w-full" />

              <div>
                <a class="flex flex-row justify-center cursor-pointer" @click.prevent="guestLogin" >
                  <p class="mx-2 text-sm text-slate-500 hover:text-green-600 transition-colors flex items-center">Continuer en tant qu'invité</p>
                  <img class="h-10 w-10 object-contain" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvEeN2h0HFHcqNI0vx1x00SjDFo2GZAS89gnBc6YVFfK_jj2guBuolKyIL&s=10" />
                </a>
              </div>

              <a href="#" class="text-sm text-green-600 hover:text-slate-600 text-center block mt-2">Mot de passe oublié</a>
            <button type="submit" class="mt-4 w-full bg-green-600 hover:text-green-200 hover:bg-green-700 text-white rounded-lg py-2">Connexion</button>
            <button type="button" class="mt-3 text-sm text-slate-500 hover:text-green-600 transition-colors" @click="mode = 'register'">
              Créer un compte
            </button>
            <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
          </form>
          </div>
        </div>

        <div class="panel panel-register" :class="{ 'is-active': mode === 'register' }">
          <div class="panel-inner">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWyHNCgCGuEzU6twdUIHgZtdvN_qiEFlXIIYqbIDfjtqdHN9X2oD8YBfKc&s=10" alt="Login" class="panel-img" />
            <form @submit.prevent="register" class="flex flex-col flex-1 items-center">
            <h2 class="text-2xl text-center mb-4">Inscription</h2>
            <input v-model="regEmail" type="email" name="email" placeholder="Email" class="text-center m-1 border rounded-lg p-2 w-full" />
            <input v-model="regPseudo" type="text" name="pseudo" placeholder="Pseudo" class="text-center m-1 border rounded-lg p-2 w-full" />
            <input v-model="regPassword" type="password" name="password" placeholder="Mot de passe" class="text-center m-1 border rounded-lg p-2 w-full" />
            <input v-model="regPasswordConfirmation" type="password" name="passwordConfirmation" placeholder="Confirmation" class="text-center m-1 border rounded-lg p-2 w-full" />
            <input v-model="regSecretToken" type="password" name="secretToken" placeholder="Secret Token" class="text-center m-1 border rounded-lg p-2 w-full" />
            <button type="submit" class="mt-4 w-full bg-green-600 text-white hover:text-green-200 hover:bg-green-700 rounded-lg py-2">Inscription</button>
            <button type="button" class="mt-3 text-sm text-slate-500 hover:text-green-600 transition-colors" @click="mode = 'login'">
              Déjà membre ? Connexion
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
    error.value = e?.data?.message ?? 'Login Failed'
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
    regError.value = e?.data?.message ?? 'Register Failed'
  }
}


</script>

<style scoped>
.stage {
  display: grid;
  overflow: hidden;
}

.panel {
  grid-area: 1 / 1;
  padding: 1.25rem 1.5rem 1.5rem;
  background: white;
  transition: transform 0.55s ease, opacity 0.55s ease;
  pointer-events: none;
  display: flex;
  justify-content: center;
}

.panel-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
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

.panel-img {
  width: 50%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
  border: 4px solid #e2e8f0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

</style>