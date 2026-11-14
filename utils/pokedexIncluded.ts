import {POKEMON_GEN} from "./pokeGen.ts";

export const GENERATION_MAP: Record<string, number> = {
    'generation-i': 1,
    'generation-ii': 2,
    'generation-iii': 3,
    'generation-iv': 4,
    'generation-v': 5,
    'generation-vi': 6,
    'generation-vii': 7,
    'generation-viii': 8,
    'generation-ix': 9,
};

type PokedexStats = {
    caught: number;
    total: number;
};

export function getGameStat(ids: number[], generation: string, isNationnal: boolean): PokedexStats | null {
    const gen = GENERATION_MAP[generation];

    if (!gen) return null;

    const min = isNationnal ? 0 : POKEMON_GEN[gen - 1];
    const max = POKEMON_GEN[gen];

    if (min === undefined || max === undefined) return null;

    const uniqueIds = new Set(ids);
    let caught = 0

    for (const id of uniqueIds) {
        if (id > min && id <= max) {
            caught++
        }
    }
    return {caught, total: max - min};
}

export function getNationnalPokedex(ids: number[], generation: string): PokedexStats | null {
    return getGameStat(ids, generation, true);
}

export function getRegionnalPokedex(ids: number[], generation: string): PokedexStats | null {
    return getGameStat(ids, generation, false);
}