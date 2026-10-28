import {getFullEvolutionChain} from "#server/utils/evolution";
import {resolveGameAppearances} from "#server/utils/gameCovers";

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const idUser = Number(event.context.user?.userId ?? 0)

    const orderedNames = await getOrderedGameNames(idUser)

    const pokemon = await prisma.pokemon.findUnique({
        where: { pokeNumber: id },
        include: {
            statuts: {
                where: { idUser: { in: [idUser, 0] } },
                select: { idUser: true, isOwned: true, isShiny: true, capturedGame: true },
            },
            pokemonPreferences: {
                where: { idUser: { in: [idUser, 0] } },
                select: { idUser: true, currentSprite: true }
            },
            types: {
                include: { type: { select: { nameEn: true } } },
            },
            abilities: {
                include: { ability: { select: { id: true, nameEn: true, nameFr: true, description: true } } },
            },
            moves: {
                include: { move: true },
            },
        },
    })

    if (!pokemon) return null

    return {
        ...pokemon,
        isOwned: pokemon.statuts.find(s => s.idUser === idUser)?.isOwned ?? false,
        isShiny: pokemon.statuts.find(s => s.idUser === idUser)?.isShiny ?? false,
        currentSprite: pokemon.pokemonPreferences.find(s => s.idUser === idUser)?.currentSprite ?? findSpriteByOrder(pokemon.availableGames, orderedNames) ?? pokemon.pokemonPreferences.find(s => s.idUser === 0)?.currentSprite ?? null,
        evolutionChain: await getFullEvolutionChain(id, idUser),
        gameAppearances: resolveGameAppearances(pokemon.gameVersions),
        statuts: undefined,
        types: pokemon.types.map(t => t.type.nameEn),
        moves: pokemon.moves,
        capturedGame: pokemon.statuts.find(s => s.idUser === idUser)?.capturedGame,
        abilities: pokemon.abilities.map(entry => ({
            id: entry.ability.id,
            nameFr: entry.ability.nameFr,
            nameEn: entry.ability.nameEn,
            description: entry.ability.description,
            isHidden: entry.isHidden,
        })).sort((a, b) => Number(a.isHidden) - Number(b.isHidden))
    }
})