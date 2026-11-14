export const useToggle = () => {
    const seeAllGames = useState('toggle:seeAllGames', () => true)

    const toggle = () => {
        seeAllGames.value = !seeAllGames.value
    }

    return { seeAllGames, toggle }
}