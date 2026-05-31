export function buildPokemonSpriteUrl(
    pokeNumber: number,
    generation: string,
    game: string,
    shiny = false
) {
    const shinyPath = shiny ? 'shiny/' : ''

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/${generation}/${game}/${shinyPath}/${pokeNumber}.png`
}