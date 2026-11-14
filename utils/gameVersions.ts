export const VERSION_TO_GROUP: Record<string, string> = {
  'red': 'red-blue',
  'blue': 'red-blue',
  'green-japan': 'red-green-japan',
  'red-japan': 'red-green-japan',
  'blue-japan': 'blue-japan',
  'yellow': 'yellow',
  'gold': 'gold-silver',
  'silver': 'gold-silver',
  'crystal': 'crystal',
  'ruby': 'ruby-sapphire',
  'sapphire': 'ruby-sapphire',
  'emerald': 'emerald',
  'firered': 'firered-leafgreen',
  'leafgreen': 'firered-leafgreen',
  'colosseum': 'colosseum',
  'xd': 'xd',
  'diamond': 'diamond-pearl',
  'pearl': 'diamond-pearl',
  'platinum': 'platinum',
  'heartgold': 'heartgold-soulsilver',
  'soulsilver': 'heartgold-soulsilver',
  'black': 'black-white',
  'white': 'black-white',
  'black-2': 'black-2-white-2',
  'white-2': 'black-2-white-2',
  'x': 'x-y',
  'y': 'x-y',
  'omega-ruby': 'omega-ruby-alpha-sapphire',
  'alpha-sapphire': 'omega-ruby-alpha-sapphire',
  'sun': 'sun-moon',
  'moon': 'sun-moon',
  'ultra-sun': 'ultra-sun-ultra-moon',
  'ultra-moon': 'ultra-sun-ultra-moon',
  'lets-go-pikachu': 'lets-go-pikachu-lets-go-eevee',
  'lets-go-eevee': 'lets-go-pikachu-lets-go-eevee',
  'sword': 'sword-shield',
  'shield': 'sword-shield',
  'the-isle-of-armor-sword': 'the-isle-of-armor',
  'the-crown-tundra-sword': 'the-crown-tundra',
  'brilliant-diamond': 'brilliant-diamond-shining-pearl',
  'shining-pearl': 'brilliant-diamond-shining-pearl',
  'legends-arceus': 'legends-arceus',
  'scarlet': 'scarlet-violet',
  'violet': 'scarlet-violet',
  'the-teal-mask-scarlet': 'the-teal-mask',
  'the-indigo-disk-scarlet': 'the-indigo-disk',
  'legends-za': 'legends-za',
  'mega-dimension': 'mega-dimension',
  'champions': 'champions',
  'icons': 'icons',
}

export const VERSION_TO_COVER_VARIANT: Record<string, string> = {
  'red': 'red-blue1',
  'blue': 'red-blue2',
  'yellow': 'yellow',
  'gold': 'gold-silver1',
  'silver': 'gold-silver2',
  'crystal': 'crystal',
  'ruby': 'ruby-sapphire1',
  'sapphire': 'ruby-sapphire2',
  'emerald': 'emerald',
  'firered': 'firered-leafgreen1',
  'leafgreen': 'firered-leafgreen2',
  'diamond': 'diamond-pearl1',
  'pearl': 'diamond-pearl2',
  'platinum': 'platinum',
  'heartgold': 'heartgold-soulsilver1',
  'soulsilver': 'heartgold-soulsilver2',
  'black': 'black-white1',
  'white': 'black-white2',
  'black-2': 'black-2-white-21',
  'white-2': 'black-2-white-22',
  'x': 'x-y1',
  'y': 'x-y2',
  'omega-ruby': 'omega-ruby-alpha-sapphire1',
  'alpha-sapphire': 'omega-ruby-alpha-sapphire2',
  'sun': 'sun-moon1',
  'moon': 'sun-moon2',
  'ultra-sun': 'ultra-sun-ultra-moon1',
  'ultra-moon': 'ultra-sun-ultra-moon2',
  'lets-go-pikachu': 'lets-go-pikachu-lets-go-eevee1',
  'lets-go-eevee': 'lets-go-pikachu-lets-go-eevee2',
  'sword': 'sword-shield1',
  'shield': 'sword-shield2',
  'brilliant-diamond': 'brilliant-diamond-shining-pearl1',
  'shining-pearl': 'brilliant-diamond-shining-pearl2',
  'legends-arceus': 'legends-arceus',
  'scarlet': 'scarlet-violet1',
  'violet': 'scarlet-violet2',
  'legends-za': 'legends-za',
}

const COVER_VARIANT_TO_GROUP = new Map<string, string>(
  Object.entries(VERSION_TO_COVER_VARIANT)
    .map(([version, file]) => [file, VERSION_TO_GROUP[version]] as const)
    .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
)

export function coverVariantForVersion(version: string): string | null {
  return VERSION_TO_COVER_VARIANT[version] ?? null
}

export function getBaseFromVariant(name: string): string {
  if (!name) return name
  return COVER_VARIANT_TO_GROUP.get(name) ?? name
}

export function isTwinPair(variants: string[]): boolean {
  if (variants.length !== 2) return false
  const [a, b] = variants
  const ba = getBaseFromVariant(a!)
  const bb = getBaseFromVariant(b!)
  return ba === bb && ba !== a && ba !== b
}

export function getTwinGroupKey(versionId: string): string {
  if (!versionId) return 'default'
  return getBaseFromVariant(versionId)
}

export function versionLabel(name: string): string {
  const map: Record<string, string> = {
    'red-blue1': 'Rouge',
    'red-blue2': 'Bleu',
    'gold-silver1': 'Or',
    'gold-silver2': 'Argent',
    'ruby-sapphire1': 'Rubis',
    'ruby-sapphire2': 'Saphir',
    'firered-leafgreen1': 'Rouge Feu',
    'firered-leafgreen2': 'Vert Feuille',
    'diamond-pearl1': 'Diamant',
    'diamond-pearl2': 'Perle',
    'platinum': 'Platine',
    'emerald': 'Émeraude',
    'crystal': 'Cristal',
    'yellow': 'Jaune',
    'heartgold-soulsilver1': 'HeartGold',
    'heartgold-soulsilver2': 'SoulSilver',
    'black-white1': 'Noir',
    'black-white2': 'Blanc',
    'black-2-white-21': 'Noir 2',
    'black-2-white-22': 'Blanc 2',
    'x-y1': 'X',
    'x-y2': 'Y',
    'omega-ruby-alpha-sapphire1': 'Rubis Oméga',
    'omega-ruby-alpha-sapphire2': 'Saphir Alpha',
    'sun-moon1': 'Soleil',
    'sun-moon2': 'Lune',
    'ultra-sun-ultra-moon1': 'Ultra-Soleil',
    'ultra-sun-ultra-moon2': 'Ultra-Lune',
    "lets-go-pikachu-lets-go-eevee1": "Let's Go Pikachu",
    "lets-go-pikachu-lets-go-eevee2": "Let's Go Évoli",
    "lets-go-pikachu-lets-go-evevee2": "Let's Go Évoli",
    'sword-shield1': 'Épée',
    'sword-shield2': 'Bouclier',
    'brilliant-diamond-shining-pearl1': 'Diamant Étincelant',
    'brilliant-diamond-shining-pearl2': 'Perle Scintillante',
    'legends-arceus': 'Légendes : Arceus',
    'legends-za': 'Légendes : Z-A',
    'scarlet-violet1': 'Écarlate',
    'scarlet-violet2': 'Violet',
  }
  return map[name] ?? name
}

export function twinPairLabel(name: string): string {
  const map: Record<string, string> = {
    'red-blue1': 'Rouge/Bleu',
    'red-blue2': 'Rouge/Bleu',
    'gold-silver1': 'Or/Argent',
    'gold-silver2': 'Or/Argent',
    'ruby-sapphire1': 'Rubis/Saphir',
    'ruby-sapphire2': 'Rubis/Saphir',
    'firered-leafgreen1': 'Rouge Feu/Vert Feuille',
    'firered-leafgreen2': 'Rouge Feu/Vert Feuille',
    'diamond-pearl1': 'Diamant/Perle',
    'diamond-pearl2': 'Diamant/Perle',
    'heartgold-soulsilver1': 'HeartGold/SoulSilver',
    'heartgold-soulsilver2': 'HeartGold/SoulSilver',
    'black-white1': 'Noir/Blanc',
    'black-white2': 'Noir/Blanc',
    'black-2-white-21': 'Noir 2/Blanc 2',
    'black-2-white-22': 'Noir 2/Blanc 2',
    'x-y1': 'X/Y',
    'x-y2': 'X/Y',
    'omega-ruby-alpha-sapphire1': 'Rubis Oméga/Saphir Alpha',
    'omega-ruby-alpha-sapphire2': 'Rubis Oméga/Saphir Alpha',
    'sun-moon1': 'Soleil/Lune',
    'sun-moon2': 'Soleil/Lune',
    'ultra-sun-ultra-moon1': 'Ultra-Soleil/Ultra-Lune',
    'ultra-sun-ultra-moon2': 'Ultra-Soleil/Ultra-Lune',
    "lets-go-pikachu-lets-go-eevee1": "Let's Go Pikachu/Évoli",
    "lets-go-pikachu-lets-go-eevee2": "Let's Go Pikachu/Évoli",
    'sword-shield1': 'Épée/Bouclier',
    'sword-shield2': 'Épée/Bouclier',
    'brilliant-diamond-shining-pearl1': 'Diamant Étincelant/Perle Scintillante',
    'brilliant-diamond-shining-pearl2': 'Diamant Étincelant/Perle Scintillante',
    'scarlet-violet1': 'Écarlate/Violet',
    'scarlet-violet2': 'Écarlate/Violet',
  }
  return map[name] ?? getBaseFromVariant(name)
}
