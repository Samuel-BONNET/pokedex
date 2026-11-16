export const useToggle = () => {
    const seeAllGames = useState('toggle:seeAllGames', () => true)

    const toggleGame = () => {
        seeAllGames.value = !seeAllGames.value
    }

    return { seeAllGames, toggleGame }
}