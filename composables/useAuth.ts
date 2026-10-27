import { useState, computed } from '#imports'

export const useAuth = () => {
    type AuthUser = { id: number; role: string }
    const user = useState<AuthUser | null>('auth:user', () => null)
    const loading = useState<boolean>('auth:loading', () => true)

    async function fetchUser() {
        loading.value = true
        try {
            const requestFetch = useRequestFetch()
            const { user: data } = await requestFetch<{ user: AuthUser | null }>('/api/user/me')
            user.value = data
        } catch { user.value = null } finally { loading.value = false }
    }

    async function setGuest() {
        const res = await $fetch<{ user: AuthUser }>('/api/auth/guest', { method: 'POST' })
        user.value = res.user
        await navigateTo('/')
    }


    async function login(email: string, password: string) {
        const res = await $fetch<{ user: { id: number; email: string; role: string } }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        user.value = { id: res.user.id, role: res.user.role }
        return res
    }

    async function logout() {
        await $fetch('/api/auth/logout', { method: 'POST' })
        user.value = null
        await navigateTo('/')
    }

    const isConnected = computed(() => user.value !== null)
    const isGuest = computed(() => user.value?.role === 'GUEST')

    return { user, loading, isConnected, isGuest, fetchUser, login, logout, setGuest }
}