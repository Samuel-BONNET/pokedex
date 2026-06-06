import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { buildPokemonSpriteUrl } from '../server/utils/sprite'

const BATCH_SIZE = 10
const DELAY_BETWEEN_BATCHES = 1500
const POKEMON_START = 1
const POKEMON_END = 1025

async function fetchPokemonApi(id: number) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch pokemon ${id}: ${res.status}`)
        return res.json()
    })
}

async function fetchPokemonSpeciesApi(id: number) {
    return await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch species ${id}: ${res.status}`)
        return res.json()
    })
}

async function fetchGenerationApi(id: number) {
    return await fetch(`https://pokeapi.co/api/v2/generation/${id}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch generation ${id}: ${res.status}`)
        return res.json()
    })
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getFrenchName(species: any): string {
    return species.names?.find((n: any) => n.language.name === 'fr')?.name ?? species.name
}

async function importGames() {
    console.log('Importing games...')
    for (let nb = 1; nb <= 9; nb++) {
        console.log(`  Generation #${nb}`)
        const generation = await fetchGenerationApi(nb)

        for (const g of generation.version_groups) {
            await prisma.game.upsert({
                where: { nameEn: g.name },
                update: { generation: nb },
                create: {
                    nameEn: g.name,
                    generation: nb,
                    currentJaquette: '',
                },
            })
        }
        await delay(300)
    }
    console.log('Games imported successfully.\n')
}

async function importPokemon() {
    const games = await prisma.game.findMany()
    const gameMap = new Map(games.map(g => [g.nameEn, g.id]))

    const users = await prisma.user.findMany({ orderBy: { id: 'asc' } })

    for (let id = POKEMON_START; id <= POKEMON_END; id++) {
        console.log(`Pokemon Importing #${id}/${POKEMON_END}`)

        const [pokemon, species] = await Promise.all([
            fetchPokemonApi(id),
            fetchPokemonSpeciesApi(id),
        ])

        const versions: Record<string, Record<string, any>> = pokemon.sprites?.versions ?? {}

        const firstVersion: string = Object.keys(versions)[0] ?? ''
        const firstVersionGames = firstVersion ? versions[firstVersion] : undefined
        const firstGame: string = firstVersionGames ? Object.keys(firstVersionGames)[0] ?? '' : ''
        const idGame: number | undefined = gameMap.get(firstGame)

        if (!idGame) {
            console.warn(`  Warning: no game found for "${firstGame}", skipping statut game provenance`)
        }

        const defaultSprite = buildPokemonSpriteUrl(id, firstVersion, firstGame)
        const frenchName = getFrenchName(species)

        const gamesList: { generation: string; game: string }[] = []
        for (const generation in versions) {
            for (const game in versions[generation]) {
                gamesList.push({ generation, game })
            }
        }

        const upsertedPokemon = await prisma.pokemon.upsert({
            where: { pokeNumber: pokemon.id },
            update: {
                currentSprite: defaultSprite,
                availableGames: gamesList,
            },
            create: {
                pokeNumber: pokemon.id,
                nameEn: pokemon.name,
                nameFr: frenchName,
                currentSprite: defaultSprite,
                availableGames: gamesList,
            },
        })

        let cpt = 0
        for (const user of users) {
            cpt++
            if (cpt === 1 || cpt % 10 === 0) {
                console.log(`  Statut ${cpt}/${users.length}`)
            }

            await prisma.statut.upsert({
                where: {
                    idPokemon_idUser: {
                        idPokemon: upsertedPokemon.id,
                        idUser: user.id,
                    }
                },
                update: {
                    currentSprite: defaultSprite,
                },
                create: {
                    idPokemon: upsertedPokemon.id,
                    idUser: user.id,
                    idGameProvenance: idGame ?? 1,
                    isOwned: false,
                    isShiny: false,
                    currentSprite: defaultSprite,
                },
            })
        }

        if (id % BATCH_SIZE === 0 && id < POKEMON_END) {
            console.log(`  Batch complete, waiting ${DELAY_BETWEEN_BATCHES}ms...`)
            await delay(DELAY_BETWEEN_BATCHES)
        }
    }
}

async function main() {
    await importGames()
    await importPokemon()
    console.log('\nImport completed successfully!')
}

main()
    .catch(err => {
        console.error('Import failed:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
