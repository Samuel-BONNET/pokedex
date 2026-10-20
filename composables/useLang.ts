import lang from '~/data/lang.json'

type DiverseKey = keyof typeof lang.img.diverse
type NameKey = keyof typeof lang.text.games.names

export type ThemeName = keyof typeof lang.themes & DiverseKey

const THEME_NAMES = Object.keys(lang.themes) as ThemeName[]

function isThemeName(value: unknown): value is ThemeName {
    return typeof value === 'string' && value in lang.themes && value in lang.img.diverse
}

export const useLang = () => {
    const theme = useState<ThemeName>('lang:theme', () => lang.meta.defaultTheme as ThemeName)

    onMounted(() => {
        try {
            const saved = localStorage.getItem(lang.meta.themeStorageKey)
            if (isThemeName(saved)) theme.value = saved
        } catch {}
    })

    watch(theme, () => {
        if (!import.meta.client) return
        localStorage.setItem(lang.meta.themeStorageKey, theme.value)
    })

    const diverse = computed(() => lang.img.diverse[theme.value])
    const themeClassesMainBackground = computed(() => lang.themes[theme.value].classes.mainBackground)
    const themeClassesSecondaryBackground = computed(() => lang.themes[theme.value].classes.secondaryBackground)
    const themeClassesColor = computed(() => lang.themes[theme.value].classes.color)
    const themeClassesBorder = computed(() => lang.themes[theme.value].classes.border)
    const themeClassesHue = computed(() => lang.themes[theme.value].classes.hue)
    const themeClassesPositionLogoImage = computed(() => lang.themes[theme.value].classes.positionLogoImage)
    const themeClassesPositionLeftImage = computed(() => lang.themes[theme.value].classes.positionLeftImage)
    const themeClassesPositionRightImage = computed(() => lang.themes[theme.value].classes.positionRightImage)
    const themeClassesLogoImageSize = computed(() => lang.themes[theme.value].classes.themeClassesLogoImageSize)
    const themeClassesRightImageSize = computed(() => lang.themes[theme.value].classes.themeClassesRightImageSize)
    const themeBackgroundImage = computed(() => lang.themes[theme.value].backgroundImage)

    function setTheme(name: ThemeName) {
        theme.value = name
    }

    function typeIcon(type: string) {
        return `${lang.img.types.dir}/${type}${lang.img.types.ext}`
    }

    function gameName(nameEn: string) {
        return lang.text.games.names[nameEn as NameKey] ?? nameEn
    }

    function coverPath(file: string) {
        return `${lang.img.games.covers.dir}/${file}`
    }

    return {
        meta: lang.meta,
        img: lang.img,
        text: lang.text,
        themes: THEME_NAMES,
        theme,
        setTheme,
        diverse,
        themeClassesMainBackground,
        themeClassesSecondaryBackground,
        themeClassesColor,
        themeClassesPositionLogoImage,
        themeClassesPositionLeftImage,
        themeClassesPositionRightImage,
        themeClassesBorder,
        themeClassesHue,
        themeClassesLogoImageSize,
        themeClassesRightImageSize,
        themeBackgroundImage,
        typeIcon,
        gameName,
        coverPath,
    }
}
