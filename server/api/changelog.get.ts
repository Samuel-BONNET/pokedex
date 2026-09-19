import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

export default defineEventHandler(() => {
    const changelogDir = join(process.cwd(), 'content', 'changelog')
    const files = readdirSync(changelogDir).filter(f => f.endsWith('.md'))

    if (files.length === 0) return { fileName: null, title: null, content: null }

    const fileName = files.sort((a, b) => b.localeCompare(a))[0]

    const content = readFileSync(join(changelogDir, fileName!), 'utf-8')

    const rawLines = content.split('\n')

    const title =  rawLines.find(l => l.trim().startsWith('#'))?.replace(/^#+\s*/, '') ?? ''

    const body = rawLines.filter(l => !l.trim().startsWith('# '))

    return {
        fileName,
        title,
        content: body.join('\n'),
    }
})