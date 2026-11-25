import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(() => {
    const { isAdmin, isConnected } = useAuth()

    if (!isAdmin.value) {
        return navigateTo(isConnected.value ? '/' : '/login')
    }
})
