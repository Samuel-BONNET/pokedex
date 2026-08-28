import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { buildPokemonSpriteUrl } from '../server/utils/sprite'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const MOD: string = process.argv[2]!
const GENERATION_CIBLE: number | undefined = process.argv[3] ? Number(process.argv[3]) : undefined
const BATCH_SIZE: number = 10
const DELAY_BETWEEN_BATCHES: number = 1500
const POKEMON_GEN: number[] = [0,151,251,386,493,649,721,809,905,1025]

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

const JQ_DIR =  join(process.cwd(), 'public', 'img', 'games', 'fr')

function loadJaquette(nomEn: string): string {

    for(const file of [`${nomEn}1.png`, `${nomEn}.png`]){
        if (existsSync(join(JQ_DIR, file))) {
            return `/img/games/fr/${file}`
        }
    }
    return ''
}

async function importGames() {
    console.log('Importing games...')
    for (let nb = 1; nb <= 9; nb++) {
        console.log(`  Generation #${nb}`)
        const generation = await fetchGenerationApi(nb)

        for (const g of generation.version_groups) {
            const game = await prisma.game.upsert({
                where: { nameEn: g.name },
                update: { generation: generation.name },
                create: {
                    nameEn: g.name,
                    generation: generation.name,
                },
            })
            await prisma.gamePreferences.upsert({
                where: {
                    idGame_idUser: { idGame: game.id, idUser: 0 }
                },
                update: { currentSprite: loadJaquette(g.name) },
                create: {
                    idGame: game.id,
                    idUser: 0,
                    currentSprite: loadJaquette(g.name),
                }
            })
        }
        await delay(300)
    }
    console.log('Games imported successfully.\n')
}

async function importPokemon(start: number, end: number) {
    const [games, sysUser] = await Promise.all([
        prisma.game.findMany(),
        prisma.user.findUnique({ where: { id: 0 } }),
    ])

    if (games.length === 0) {
        console.error('  Aucun jeu en base. Exécute d\'abord: pnpm import:games')
        process.exit(1)
    }
    if (!sysUser) {
        console.error('  Utilisateur System (id=0) introuvable. Exécute d\'abord: pnpm prisma:seed')
        process.exit(1)
    }

    for (let id = POKEMON_GEN[start-1]!+1; id <= POKEMON_GEN[end-1]!; id++) {
        console.log(`Pokemon Importing #${id - POKEMON_GEN[start-1]!}/${POKEMON_GEN[end-1]!-POKEMON_GEN[start-1]!}`)

        const [pokemon, species] = await Promise.all([
            fetchPokemonApi(id),
            fetchPokemonSpeciesApi(id),
        ])

        const versions: Record<string, Record<string, any>> = pokemon.sprites?.versions ?? {}
        const frenchName = getFrenchName(species)

        const gamesList: { generation: string; game: string }[] = []
        for (const generation in versions) {
            for (const game in versions[generation]) {
                if (!versions[generation][game]?.front_default) continue
                gamesList.push({ generation, game })
            }
        }

        const enrichedGamesList = gamesList.map((item) => ({
            generationName: item.generation,
            game: item.game,
            sprite: buildPokemonSpriteUrl(id, item.generation, item.game),
        }))

        const types = (pokemon.types ?? []).map((type: any) => type.type.name)

        const stats = (pokemon.stats ?? []).map((stat: any) => ({ name: stat.stat.name, value: stat.base_stat }))

        const defaultSprite = enrichedGamesList[0]?.sprite ?? pokemon.sprites.front_default ?? ''

        let pokemonId: number
        if(MOD != "statut"){
            const dbPokemon = await prisma.pokemon.upsert({
                where: {
                    pokeNumber: id
                },
                update: {
                    id: id,
                    pokeNumber: id,
                    nameEn: pokemon.name,
                    nameFr: frenchName,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    stats: stats,
                    types: types,
                    availableGames: enrichedGamesList,
                },
                create: {
                    id: id,
                    pokeNumber: id,
                    nameEn: pokemon.name,
                    nameFr: frenchName,
                    height: pokemon.height,
                    weight: pokemon.weight,
                    stats: stats,
                    types: types,
                    availableGames: enrichedGamesList,
                },
            })
            pokemonId = dbPokemon.id
        } else {
            const dbPokemon = await prisma.pokemon.findUniqueOrThrow({
                where: {
                    pokeNumber: id
                }
            })
            pokemonId = dbPokemon.id
        }

        await prisma.statut.upsert({
            where: {
                idPokemon_idUser: {
                    idPokemon: pokemonId,
                    idUser: 0,
                }
            },
            update: {
                idPokemon: pokemonId,
                idUser: 0,
                isOwned: false,
                isShiny: false,
            },
            create: {
                idPokemon: pokemonId,
                idUser: 0,
                isOwned: false,
                isShiny: false,
            },
        })

        await prisma.pokemonPreferences.upsert({
            where: {
                idPokemon_idUser: {
                    idPokemon: pokemonId,
                    idUser: 0,
                }
            },
            update: {
                currentSprite: defaultSprite,
                idPokemon: pokemonId,
                idUser: 0,
            },
            create: {
                currentSprite: defaultSprite,
                idPokemon: pokemonId,
                idUser: 0,
            }
        })


        if (MOD !== "statut" && species?.evolves_from_species) {
            const fromId = Number(species.evolves_from_species.url.split("/").filter(Boolean).pop())
            const exists = await prisma.pokemon.count({ where: { id: { in: [fromId, pokemonId] } } })
            if (exists === 2) {
                await prisma.evolution.upsert({
                    where: { fromPokemonId_toPokemonId: { fromPokemonId: fromId, toPokemonId: pokemonId } },
                    update: {},
                    create: { fromPokemonId: fromId, toPokemonId: pokemonId },
                })
            }
        }




        if (id % BATCH_SIZE === 0 && id < end) {
            console.log(`  Batch complete, waiting ${DELAY_BETWEEN_BATCHES}ms...`)
            await delay(DELAY_BETWEEN_BATCHES)
        }
    }
}

async function main() {
    switch(MOD){
        case "pokemon":
        case "statut":
            if(GENERATION_CIBLE === undefined) {
                await importPokemon(1,9)
            }
            else{
                await importPokemon(GENERATION_CIBLE,GENERATION_CIBLE+1)
            }
            break;
        case "games":
            await importGames()
            break;
        case "all":
            await importGames()
            await importPokemon(GENERATION_CIBLE!,GENERATION_CIBLE!+1)
            break;
    }
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
