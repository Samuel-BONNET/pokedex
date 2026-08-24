const STORAGE_KEY = 'pokedex:prefs'

export function usePokedexPrefs() {
    const cardsPerRow = ref(7)
    const cardNumber = ref(50)
    const currentPage = ref(1)

    onMounted(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
            if ([5,7,9].includes(saved.cardPerRow)) cardsPerRow.value = saved.cardPerRow
            if ([50, 200, 500, 1025].includes(saved.cardNumber)) cardNumber.value = saved.cardNumber
            if (Number.isInteger(saved.currentPage) && saved.currentPage >= 1) currentPage.value = saved.currentPage
        } catch {}
    })

    watch([cardsPerRow, cardNumber, currentPage], () => {
        if (!import.meta.client) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            cardsPerRow: cardsPerRow.value,
            cardNumber: cardNumber.value,
            currentPage: currentPage.value,
        }))
    })

    return { cardsPerRow, cardNumber, currentPage }
}