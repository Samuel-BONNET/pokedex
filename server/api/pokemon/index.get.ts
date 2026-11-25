import {SYSTEM_USER_ID} from "#server/utils/constants.ts";

export default defineEventHandler(async (event) => {
    const idUser = Number(event.context.user?.userId ?? SYSTEM_USER_ID)

    const orderedName = await getOrderedGameNames(idUser)

    const orderedNameSys = await getOrderedGameNames(SYSTEM_USER_ID)

    const query = getQuery(event)
    const moveIds = String(query.moves ?? '')
        .split(',').map(Number)
        .filter(n => Number.isInteger(n) && n > 0)
    const moveMode = query.moveMatchMode === 'all' ? 'all' : 'any'

    const moveWhere = moveIds.length === 0 ? {} : moveMode === 'all'
        ? { AND: moveIds.map(moveId => ({ moves: { some: { moveId } } })) }
        : { moves: { some: { moveId: { in: moveIds } } } }

    const pokemon = await prisma.pokemon.findMany({
        where: moveWhere,
        orderBy: { pokeNumber: 'asc' },
        include: {
            statuts: {
                where: { idUser: { in: [idUser, SYSTEM_USER_ID] } },
                select: { idUser: true, isOwned: true, isShiny: true, capturedGame: true },
            },
            pokemonPreferences: {
                where: { idUser: { in: [idUser, SYSTEM_USER_ID] } },
                select: { idUser: true, currentSprite: true }
            },
            types: {
                include: { type: { select: { nameEn: true } } },
            }
        },
    })
    return pokemon.map(p => ({
        ...p,
        types: p.types.map(t => t.type.nameEn),
        isOwned: p.statuts.find(s => s.idUser === idUser)?.isOwned ?? false,
        isShiny: p.statuts.find(s => s.idUser === idUser)?.isShiny ?? false,
        capturedGame: p.statuts.find(s => s.idUser === idUser)?.capturedGame ?? [],
        currentSprite: p.pokemonPreferences.find(s => s.idUser === idUser)?.currentSprite ?? findSpriteByOrder(p.availableGames, orderedName) ?? findSpriteByOrder(p.availableGames, orderedNameSys) ?? p.pokemonPreferences.find(s => s.idUser === SYSTEM_USER_ID)?.currentSprite ?? null,
        statuts: undefined,
    }))
})