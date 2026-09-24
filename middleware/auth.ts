import {useAuth} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path === '/login') return

    const { loading, user, guest } = useAuth()

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

    if (!user.value && !guest.value) {
        return navigateTo('/login')
    }
})