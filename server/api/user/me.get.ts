export default defineEventHandler((event) => {
    const user = event.context.user

    return {
        userId: user?.userId ?? 0
    }
})