import creditsRaw from '~/credits.md?raw'

const sections = parseCreditsSections(creditsRaw)
const LOGIN_URLS = authImageUrls(sections, 'Login')
const REGISTER_URLS = authImageUrls(sections, 'Register')

export function useAuthImages() {
    const slot = useState('auth:image-slot', () => getAuthSlot())

    const loginImage = computed(() => pickBySlot(LOGIN_URLS, 'login', slot.value))
    const registerImage = computed(() => pickBySlot(REGISTER_URLS, 'register', slot.value))

    let timer: ReturnType<typeof setTimeout> | undefined

    function refresh() {
        slot.value = getAuthSlot()
    }

    function schedule() {
        if (timer) clearTimeout(timer)
        const delay = AUTH_SLOT_MS - (Date.now() % AUTH_SLOT_MS) + 50
        timer = setTimeout(() => {
            refresh()
            schedule()
        }, Math.max(1_000, delay))
    }

    function onVisibilityChange() {
        if (document.visibilityState !== 'visible') return
        refresh()
        schedule()
    }

    onMounted(() => {
        refresh()
        schedule()
        document.addEventListener('visibilitychange', onVisibilityChange)
    })

    onUnmounted(() => {
        if (timer) clearTimeout(timer)
        document.removeEventListener('visibilitychange', onVisibilityChange)
    })

    return { loginImage, registerImage }
}