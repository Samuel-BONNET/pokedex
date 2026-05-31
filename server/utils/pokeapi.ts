interface PokemonApiResponse {
    sprites: {
        versions: Record<
            string,
            Record<string, unknown>
        >
    }
}

export async function fetchPokemon(name: string) {
    return await $fetch<PokemonApiResponse>(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    )
}