import { useState, computed } from '#imports'

export const useAuth = () => {
    const user = useState<{ id: number } | null>('auth:user', () => null)
    const loading = useState<boolean>('auth:loading', () => true)

    async function fetchUser() {
        loading.value = true
        try {
            const data = await $fetch<{ userId: number }>('/api/user/me')
            user.value = data.userId ? { id: data.userId } : null
        } catch {
            user.value = null
        } finally {
            loading.value = false
        }
    }

    async function login(email: string, password: string) {
        const res = await $fetch<{ user: { id: number; email: string; role: string } }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        })
        user.value = { id: res.user.id }
        return res
    }

    async function logout() {
        await $fetch('/api/auth/logout', { method: 'POST' })
        user.value = null
        await navigateTo('/')
    }

    const isConnected = computed(() => user.value !== null)

    return { user, loading, isConnected, fetchUser, login, logout }
}