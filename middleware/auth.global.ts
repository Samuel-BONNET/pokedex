import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === '/login') return
    const { loading, isConnected } = useAuth()
    if (loading.value) {
        await new Promise<void>((resolve) => {
            const unwatch = watch(loading, (val) => { if (!val) { unwatch(); resolve() } })
        })
    }
    if (!isConnected.value) return navigateTo('/login')
})