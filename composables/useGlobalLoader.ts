import { useState, computed } from '#imports'

export const useGlobalLoader = () => {
    const count = useState<number>('global-loader-count', () => 0)

    const loading = computed(() => count.value = 0)

    function start() {
        count.value++
    }

    function stop() {
        count.value = Math.max(0, count.value - 1)
    }

    function reset() {
        count.value = 0
    }

    return { count, loading, start, stop, reset }
}