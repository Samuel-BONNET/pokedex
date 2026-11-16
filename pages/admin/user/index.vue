<template>
  <div class="bg-neutral-300 border-4 border-neutral-700 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col justify-center items-center gap-4 w-fit text-neutral-900 font-mono">
    <h3 class="text-2xl font-bold">{{ text.auth.admin }}</h3>

    <p v-if="actionError" class="text-red-600">{{ actionError }}</p>
    <p v-if="pending">Chargement...</p>
    <template v-else-if="error">
      <p class="text-red-600">Impossible de charger les comptes.</p>
      <button type="button" class="px-4 py-2 text-xs font-bold bg-white border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5" @click="refresh()">
        Réessayer
      </button>
    </template>
    <ul v-else class="flex flex-col w-full">
      <li class="flex justify-between gap-6 bg-white border-2 border-neutral-700 px-3 py-2 mb-3 font-bold">
        <span>Id</span>
        <span>Pseudo</span>
        <span>Role</span>
        <span>Status</span>
      </li>
      <li v-for="user in users ?? []" :key="user.id" class="flex justify-between gap-0 even:bg-white odd:bg-green-200 px-3 py-2 font-bold" :class="!user.isActive && 'text-red-500'">
        <span>{{ user.id }}</span>
        <span>{{ user.pseudo }}</span>
        <span>{{ user.role }}</span>
        <button type="button"
                :disabled="pendingIds.includes(user.id) || isProtected(user.id)"
                class="px-2 py-1 text-xs font-bold bg-white border-2 border-neutral-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                @click="toggleActive(user)">
          {{ pendingIds.includes(user.id) ? '...' : (user.isActive ? 'Disable' : 'Enable') }}
        </button>
        <NuxtLink :to="`/admin/user/${user.id}`" class="underline hover:no-underline">Voir</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type AdminUser = {
  id: number
  pseudo: string
  role: string
  isActive: boolean
}

definePageMeta({ middleware: 'admin' })

const { text } = useLang()
const { user: adminUser } = useAuth()
const { data: users, pending, error, refresh } = await useFetch<AdminUser[]>('/api/user')

const pendingIds = ref<number[]>([])
const actionError = ref<string | null>(null)
const protectedUserIds = [1, 2]

function isProtected(id: number) {
  return id === adminUser.value?.id || protectedUserIds.includes(id)
}

async function toggleActive(user: AdminUser) {
  if (pendingIds.value.includes(user.id) || isProtected(user.id)) return
  if (user.isActive && !window.confirm(`Désactiver le compte ${user.pseudo} ?`)) return

  actionError.value = null
  pendingIds.value.push(user.id)

  try {
    const updated = await $fetch<AdminUser>(`/api/user/${user.id}`, {
      method: 'PATCH',
      body: { isActive: !user.isActive },
    })
    const index = users.value?.findIndex(u => u.id === user.id) ?? -1
    if (users.value && index !== -1) users.value[index] = updated
  } catch (e: any) {
    actionError.value = e?.data?.statusMessage ?? 'Impossible de mettre à jour le compte.'
  } finally {
    pendingIds.value = pendingIds.value.filter(id => id !== user.id)
  }
}
</script>
