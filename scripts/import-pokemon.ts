import 'dotenv/config'
import { prisma } from '../server/utils/prisma'
import { buildPokemonSpriteUrl } from '../server/utils/sprite'
import lang from '../data/lang.json'
import { existsSync, readFileSync } from 'node:fs'
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

async function fetchPokemonAbilitiesAPI(id: number){
    return await fetch(`https://pokeapi.co/api/v2/ability/${id}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ability ${id}: ${res.status}`)
        return res.json()
    })
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getFrenchName(species: any): string {
    return species.names?.find((n: any) => n.language.name === 'fr')?.name ?? species.name
}

const COVERS_DIR = lang.img.games.covers.dir
const JQ_DIR = join(process.cwd(), 'public', COVERS_DIR.replace(/^\/+/, ''))

function loadJaquette(nomEn: string): string {

    for(const file of [`${nomEn}1.png`, `${nomEn}.png`]){
        if (existsSync(join(JQ_DIR, file))) {
            return `${COVERS_DIR}/${file}`
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
                    game: { connect: { id: game.id } },
                    user: { connect: { id: 0 } },
                    currentSprite: loadJaquette(g.name),
                },
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

    const dbTypes = await prisma.type.findMany({ select: { id: true, nameEn: true } })
    const typeIdByName = new Map(dbTypes.map(t => [t.nameEn, t.id]))
    const dbAbilities = await prisma.ability.findMany({ select: { id: true } })
    const abilityIds = new Set(dbAbilities.map(a => a.id))

    if (games.length === 0) {
        console.error('Aucun jeu en base. Exécute d\'abord: pnpm import:games')
        process.exit(1)
    }
    if (!sysUser) {
        console.error('Utilisateur System (id=0) introuvable. Exécute d\'abord: pnpm prisma:seed')
        process.exit(1)
    }
    if (dbAbilities.length === 0) {
        console.error("Aucun talent en base. Exécute d'abord: pnpm import:ability")
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

        const typeIds = (pokemon.types ?? []).map((type: any) => typeIdByName.get(type.type.name)).filter((typeId: any): typeId is number => typeId !== undefined)

        const stats = (pokemon.stats ?? []).map((stat: any) => ({ name: stat.stat.name, value: stat.base_stat }))

        let pokemonId: number
        if(MOD != "statut"){
            const pokemonData = {
                pokeNumber: id,
                nameEn: pokemon.name,
                nameFr: frenchName,
                height: pokemon.height,
                weight: pokemon.weight,
                stats,
                availableGames: enrichedGamesList,
            }

            const updated = await prisma.pokemon.updateMany({
                where: { pokeNumber: id },
                data: pokemonData,
            })

            if (updated.count === 0) {
                await prisma.pokemon.createMany({
                    data: [{ id, ...pokemonData }],
                })
            }

            const dbPokemon = await prisma.pokemon.findUniqueOrThrow({
                where: { pokeNumber: id },
                select: { id: true },
            })
            pokemonId = dbPokemon.id

            await prisma.pokemonType.deleteMany({ where: { pokemonId } })

            if (typeIds.length > 0) {
                await prisma.pokemonType.createMany({
                    data: typeIds.map((typeId: number) => ({ pokemonId, typeId })),
                    skipDuplicates: true,
                })
            }
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
                },
            },
            update: {
                isOwned: false,
                isShiny: false,
            },
            create: {
                pokemon: { connect: { id: pokemonId } },
                user: { connect: { id: 0 } },
                isOwned: false,
                isShiny: false,
            },
        })


        if (MOD !== "statut" && species?.evolves_from_species) {
            const fromId = Number(species.evolves_from_species.url.split("/").filter(Boolean).pop())
            const exists = await prisma.pokemon.count({ where: { id: { in: [fromId, pokemonId] } } })
            if (exists === 2) {
                await prisma.evolution.upsert({
                    where: { fromPokemonId_toPokemonId: { fromPokemonId: fromId, toPokemonId: pokemonId } },
                    update: {},
                    create: {
                        pokemon: { connect: { id: fromId } },
                        nextPokemon: { connect: { id: pokemonId } },
                    },
                })
            }
        }

        const gameWithJaquette = await prisma.game.findMany({
            where: { gamePreferences: { some: { idUser: 0, currentSprite: { not: '' } } } },
            orderBy: { id: 'asc' },
        })

        const systemOrder = gameWithJaquette.map(g => g.id)
        const RANKED_TIER_COUNT = lang.text.preferences.tiers.length - 1
        const base = Math.floor(systemOrder.length / RANKED_TIER_COUNT)
        const rest = systemOrder.length % RANKED_TIER_COUNT
        const gameTierSizes = lang.text.preferences.tiers.map((_, i) =>
            i < RANKED_TIER_COUNT ? base + (i < rest ? 1 : 0) : 0,
        )

        await prisma.user.update({
            where: { id: 0 },
            data: { preferences: { gameOrder: systemOrder, gameTierSizes } }
        })

        if (id % BATCH_SIZE === 0 && id < end) {
            console.log(`  Batch complete, waiting ${DELAY_BETWEEN_BATCHES}ms...`)
            await delay(DELAY_BETWEEN_BATCHES)
        }

        const abilityLinks = (pokemon.abilities ?? []).map((entry: any) => ({ abilityId: Number(entry.ability?.url?.split('/').filter(Boolean).at(-1)), isHidden: Boolean(entry.is_hidden)}))
            .filter((entry: any) => Number.isInteger(entry.abilityId) && abilityIds.has(entry.abilityId))

        await prisma.pokemonAbility.deleteMany({ where: { pokemonId } })

        if (abilityLinks.length > 0) {
            await prisma.pokemonAbility.createMany({
                data: abilityLinks.map((entry: any) => ({ pokemonId, ...entry })),
                skipDuplicates: true,
            })
        }
    }
}

async function importAbilities(){
    const abilityList = await fetch(`https://pokeapi.co/api/v2/ability?limit=1000`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch global ability : ${res.status}`)
        return res.json()
    })

    const total: number = abilityList.count

    for (const [index, entry] of abilityList.results.entries()) {
        try {
            const res = await fetch(entry.url);
            if (!res.ok) continue;
            const currentAbility = await res.json();

            const nameFrObj = currentAbility.names.find((n: { language: { name: string } }) => n.language.name === 'fr');
            const nameFr = nameFrObj ? nameFrObj.name : currentAbility.name;

            const effectFrObj = currentAbility.effect_entries.find((e: { language: { name: string } }) => e.language.name === 'fr');
            const description = effectFrObj ? effectFrObj.effect : "Pas de description disponible.";

            const nameEn = currentAbility.name;

            const abilityData = { nameFr, nameEn, description }

            const updated = await prisma.ability.updateMany({
                where: { id: currentAbility.id },
                data: abilityData,
            })

            if (updated.count === 0) {
                await prisma.ability.createMany({
                    data: [{ id: currentAbility.id, ...abilityData }],
                })
            }
            console.log(`Importing Ability #${index + 1}/${total}`);
        } catch (error) {
            // @ts-ignore
            console.error(`Error: Ability ${entry.name}:`, error.message);
        }
    }
}

async function importMoves(){
    const moveList = await fetch(`https://pokeapi.co/api/v2/move?limit=2000`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch global move : ${res.status}`)
        return res.json()
    })

    const existingPokemonIds = new Set(
        (await prisma.pokemon.findMany({ select: { id: true } })).map(p => p.id)
    )

    const total: number = moveList.count

    for (const [index, entry] of moveList.results.entries()) {
        try {
            const res = await fetch(entry.url);
            if (!res.ok) continue;
            const currentMove = await res.json();
            const meta = currentMove.meta;

            const nameFrObj = currentMove.names.find((n: { language: { name: string} }) => n.language.name === 'fr');
            const nameFr = nameFrObj ? nameFrObj.name : currentMove.name;
            const nameEn = currentMove.name
            const type = currentMove.type.name
            const category = currentMove.meta?.category?.name ?? 'unknown'
            const accuracy = currentMove.accuracy
            const effectChance = currentMove.effect_chance
            const pp = currentMove.pp
            const priority = currentMove.priority
            const power = currentMove.power
            const contestCombos = JSON.stringify(currentMove.contest_combos ?? {})
            const damageClass = currentMove.damage_class.name
            const minHits = meta?.min_hits
            const maxHits = meta?.max_hits
            const minTurns = meta?.min_turns
            const maxTurns = meta?.max_turns
            const drain = meta?.drain
            const healing = meta?.healing
            const critRate = meta?.critRate
            const ailmentChance = meta?.ailment_chance
            const flinchChance = meta?.flinch_chance
            const statChance = meta?.stat_chance
            const target = currentMove.target.name
            const effectEntries = JSON.stringify(currentMove.effect_entries ?? [])
            const flavor_text = currentMove.flavor_text_entries.find((n: any) => n.language.name === 'fr')?.flavor_text ?? currentMove.flavor_text_entries.find((n: any) => n.language.name === 'en')?.flavor_text ??
                currentMove.effect_entries.find((e: any) => e.language.name === 'en')?.short_effect ?? ''
            const description = flavor_text.replace(/[\n\f\r]+/g, ' ')

            const moveData = {
                nameFr,
                nameEn,
                type,
                category,
                accuracy,
                effectChance,
                pp,
                priority,
                power,
                contestCombos,
                damageClass,
                minHits,
                maxHits,
                minTurns,
                maxTurns,
                drain,
                healing,
                critRate,
                ailmentChance,
                flinchChance,
                statChance,
                target,
                effectEntries,
                description,
            }

            const updated = await prisma.move.updateMany({
                where: { id: currentMove.id },
                data: moveData,
            })

            if (updated.count === 0) {
                await prisma.move.createMany({
                    data: [{ id: currentMove.id, ...moveData }],
                })
            }

            const learnedBy = currentMove.learned_by_pokemon
                .map((pokemon: { url: string }) => Number(pokemon.url.split('/').filter(Boolean).at(-1)))
                .filter((pokemonId: number) => Number.isInteger(pokemonId) && existingPokemonIds.has(pokemonId))

            if (learnedBy.length > 0) {
                await prisma.pokemonMove.createMany({
                    data: learnedBy.map((pokemonId: number) => ({
                        pokemonId,
                        moveId: currentMove.id,
                    })),
                    skipDuplicates: true,
                })
            }

            console.log(`Importing Move #${index + 1}/${total}`);
        } catch (error) {
            // @ts-ignore
            console.error(`Erreur sur la capacité ${entry.name}:`, error.message);
        }
    }
}

async function importTypes(){
    await fetch(`https://pokeapi.co/api/v2/type?limit=25`).then(async res => {
        if (!res.ok) throw new Error(`Failed to fetch global type : ${res.status}`)
        const allTypes = await res.json()

        const csv = readFileSync(join(process.cwd(), 'scripts/pokemon_type_chart.csv'), 'utf8')
        const [headerLine, ...rows] = csv.trim().split(/\r?\n/)
        const typeNames = headerLine!.split(',').slice(1).map(t => t.trim().toLowerCase())
        const chart = new Map<string, Map<string, number>>()

        for (const row of rows) {
            const [attacker, ...values] = row.split(',')
            chart.set(attacker!.trim().toLowerCase(), new Map(typeNames.map((defender, index) => [defender, Number(values[index])])),
            )
        }

        const total: number = allTypes.count

        for (const [index, type] of allTypes.results.entries()) {
            const id = Number(type.url.split('/').filter(Boolean).at(-1))
            if (!Number.isInteger(id) || id > 18) continue

            const name = type.name.toLowerCase()
            const strength = typeNames.filter(defender => (chart.get(name)?.get(defender) ?? 0) > 1)
            const weaknesses = typeNames.filter(attacker => (chart.get(attacker)?.get(name) ?? 0) > 1)

            try{
                const typeData = { nameEn: name, strength, weaknesses }

                const updated = await prisma.type.updateMany({
                    where: { id },
                    data: typeData,
                })

                if (updated.count === 0) {
                    await prisma.type.createMany({
                        data: [{ id, ...typeData }],
                    })
                }
                console.log(`Importing Types #${index + 1}/${total}`)
            } catch (error) {
                // @ts-ignore
                console.error(`Error Type ${name} : `, error.message)
            }
        }
    })
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
        case "ability":
            await importAbilities()
            break;
        case "move":
            await importMoves()
            break;
        case "type":
            await importTypes()
            break;
        case "all":
            await importGames()
            await importTypes()
            await importAbilities()
            if(GENERATION_CIBLE === undefined) {
                await importPokemon(1,9)
            }
            else {
                await importPokemon(GENERATION_CIBLE, GENERATION_CIBLE+1)
            }
            await importMoves()
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
