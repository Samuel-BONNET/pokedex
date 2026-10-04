export default defineEventHandler((event) => {
    const user = event.context.user

    return user ? { user: { id: user.userId, role: user.role } } : { user: null }
})