import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path === '/login' || to.path === '/register') return

    const { loading, user } = useAuth()

    if (loading.value) {
        await new Promise<void>((resolve) => {
            const unwatch = watch(loading, (val) => {
                if (!val) {
                    unwatch()
                    resolve()
                }
            })
        })
    }

    if (!user.value) {
        return navigateTo('/login')
    }
})