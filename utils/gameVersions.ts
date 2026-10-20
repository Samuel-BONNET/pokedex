export function getBaseFromVariant(name: string): string {
  if (!name) return name
  const m = name.match(/^(.*?)(1|2|21|22)$/)
  if (m) {
    return m[1]
  }
  return name
}

export function isTwinPair(variants: string[]): boolean {
  if (variants.length !== 2) return false
  const [a, b] = variants
  const ba = getBaseFromVariant(a)
  const bb = getBaseFromVariant(b)
  return ba === bb && ba !== a && ba !== b
}

export function getTwinGroupKey(versionId: string): string {
  if (!versionId) return 'default'
  const base = getBaseFromVariant(versionId)
  if (base === versionId) {
    // check if it's a base that represents pair? usually not
    return base
  }
  return base
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
