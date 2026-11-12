import {useGlobalLoader} from "~/composables/useGlobalLoader.ts";

export default defineNuxtPlugin(() => {
    const { start, stop } = useGlobalLoader()
    const originalFetch = globalThis.$fetch

    globalThis.$fetch = ((input: any, init?: any) => {
        start()
        return Promise.resolve(originalFetch(input, init)).finally(() => { stop() })
    }) as typeof $fetch
})