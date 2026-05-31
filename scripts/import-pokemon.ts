import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { buildPokemonSpriteUrl } from '../server/utils/sprite'

async function fetchPokemonApi(id: number) {
    return await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`
    ).then(res => res.json())
}

async function fetchPokemonSpecies(id: number) {
    return await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    ).then(res => res.json())
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// TODO segmenté seed : / générations
async function main() {
    for (let id = 1; id <= 10; id++) {
        console.log(`Importing #${id}`)

        const pokemon = await fetchPokemonApi(id)
        const species = await fetchPokemonSpecies(id)

        const nameFr =
            species.names.find((n: any) => n.language.name === 'fr')?.name ??
            pokemon.name

        await delay(150)

        const versions = pokemon.sprites?.versions ?? {}

        const games: {
            generation: string
            game: string
        }[] = []

        const firstGeneration = Object.keys(versions)[0]
        if (!firstGeneration) throw new Error("No generation found")

        const firstGame = Object.keys(versions[firstGeneration] ?? {})[0]
        if (!firstGame) throw new Error("No game found")

        const currentSprite: string = buildPokemonSpriteUrl(pokemon.id, firstGeneration, firstGame, false)

        for (const generation in versions) {
            const generationGames = versions[generation]

            for (const game in generationGames) {
                games.push({
                    generation,
                    game,
                })
            }
        }

        await prisma.pokemon.upsert({
            where: {
                pokeNumber: pokemon.id,
            },
            update: {
                availableGames: games,
                currentSprite,
            },
            create: {
                pokeNumber: pokemon.id,
                nameEn: pokemon.name,
                nameFr: nameFr,
                availableGames: games,
                currentSprite: currentSprite,
            },
        })
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })