export default defineEventHandler(async(event) => {
    const body = await readBody(event)
    const idUser = body.idUser ?? 0
    const order: number[] = Array.isArray(body.order) ? body.order.map(Number): []

    if ( idUser === 0 || !order.length ) return

    
})