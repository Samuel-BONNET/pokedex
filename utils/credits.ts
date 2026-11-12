export const AUTH_SLOT_MS = 10 * 60_000

export type CreditsSection = { title: string; lines: string[] }

export function parseCreditsSections(raw: string): CreditsSection[] {
    const sections: CreditsSection[] = []
    let current: CreditsSection | null = null

    for (const rawLine of raw.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line) continue

        const heading = line.match(/^#{1,6}\s+(.+?)\s*#*$/)
        if (heading) {
            current = { title: heading[1]!.trim(), lines: [] }
            sections.push(current)
            continue
        }

        current?.lines.push(line)
    }

    return sections
}

export function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export function authImageUrls(sections: CreditsSection[], title: string): string[] {
    const section = sections.find(s => s.title.toLowerCase() === title.toLowerCase())
    return [...new Set((section?.lines ?? []).filter(isHttpUrl))]
}

export function getAuthSlot(now = Date.now(), size = AUTH_SLOT_MS): number {
    return Math.floor(now / size)
}

export function pickBySlot<T>(items: T[], key: string, slot: number): T | null {
    if (items.length === 0) return null

    let hash = 2166136261
    const input = `${key}:${slot}`
    for (let i = 0; i < input.length; i++) {
        hash = Math.imul(hash ^ input.charCodeAt(i), 16777619)
    }

    return items[(hash >>> 0) % items.length]!
}