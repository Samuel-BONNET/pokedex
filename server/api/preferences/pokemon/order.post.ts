export default defineEventHandler(async(event) => {
    const body = await readBody(event)
    const idUser = event.context.user?.userId
    const order: number[] = Array.isArray(body.order) ? body.order.map(Number): []

    if (!idUser || !order.length ) return

    
})