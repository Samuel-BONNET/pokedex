import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const idPokemon = Number(getRouterParam(event, 'id'))
    const body = await readBody(event)
    const idUser = event.context.user?.userId
    if (!idUser) return

    const result = await prisma.pokemonPreferences.upsert({
        where: { idPokemon_idUser: { idPokemon, idUser } },
        update: { currentSprite: body.currentSprite },
        create: { idPokemon, idUser, currentSprite: body.currentSprite },
    })

    const defaultPrefs = await prisma.pokemonPreferences.findUnique({
        where: {idPokemon_idUser: {idPokemon, idUser: SYSTEM_USER_ID}}
    })

    if (defaultPrefs && result.currentSprite === defaultPrefs.currentSprite) {
        await prisma.pokemonPreferences.delete({
            where: { idPokemon_idUser: { idPokemon, idUser } }
        })
        return { deleted: true }
    }
    return result
})