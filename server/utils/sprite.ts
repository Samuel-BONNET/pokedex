export function buildPokemonSpriteUrl(
    pokeNumber: number,
    generation: string,
    game: string,
    shiny = false
) {
    const shinyPath = shiny ? 'shiny/' : ''

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/${generation}/${game}/${shinyPath}/${pokeNumber}.png`
}

const SPRITE_ALIASES: Record<string, string[]> = {
    "gold-silver": ["gold", "silver"],
    "omega-ruby-alpha-sapphire": ["omegaruby", "alphasapphire"],
    "black-2-white-2": ["black-white"],
    "sun-moon": ["ultra-sun-ultra-moon"],
}

export async function getOrderedGameNames(idUser: number): Promise<string[]> {
    if (!idUser) return []
    const user = await prisma.user.findUnique({
        where: { id: idUser },
        select: { preferences: true },
    })
    const gameOrder = (user?.preferences as Record<string, number[]>)?.gameOrder ?? []
    if (!gameOrder.length) return []

    const games = await prisma.game.findMany({
        where: { id: { in: gameOrder } },
        select: { id: true, nameEn: true },
    })
    const nameById = new Map(games.map(g => [g.id, g.nameEn]))
    return gameOrder.map(id => nameById.get(id)).filter((n): n is string => !!n)
}

export function findSpriteByOrder(availableGames: unknown, orderedNames: string[]): string | null {
    if (!Array.isArray(availableGames)) return null
    for (const name of orderedNames) {
        const candidates = [name, ...(SPRITE_ALIASES[name] || [])]
        const match = availableGames.find(a => candidates.includes(a.game))
        if (match) return match.sprite
    }
    return null
}

export function shinyUrl(url: string) {
    if(url.includes('red-blue') || url.includes('yellow')) return url
    const lastSlash = url.lastIndexOf('/')
    return url.slice(0, lastSlash) + '/shiny' + url.slice(lastSlash)
}