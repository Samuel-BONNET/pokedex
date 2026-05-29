import 'dotenv/config'
import { prisma } from '../server/utils/prisma'

async function fetchPokemonApi(id: number) {
    return await fetch(
        `https://pokeapi.co/api/v2/pokemon/${id}`
    ).then(res => res.json())
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
    for (let id = 1; id <= 1025; id++) {
        console.log(`Importing #${id}`)

        const pokemon = await fetchPokemonApi(id)
        await delay(150)

        const versions = pokemon.sprites?.versions ?? {}

        const games: {
            generation: string
            game: string
        }[] = []

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
            },
            create: {
                pokeNumber: pokemon.id,
                nameEn: pokemon.name,
                nameFr: pokemon.name,
                availableGames: games,
            },
        })
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect()
    })