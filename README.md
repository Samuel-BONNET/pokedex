# Pokedex

## Prérequis

- Node.js 20+
- pnpm
- Docker + Docker Compose

## Setup local

```bash
# 1. Installer les dépendances
pnpm install

# 2. Démarrer PostgreSQL
docker compose up -d postgres

# 3. Appliquer les migrations Prisma
pnpm prisma:migrate

# 4. Générer le client Prisma
pnpm prisma:generate

# 5. Charger les comptes prédéfinis
pnpm prisma:seed

# 6. Importe les jeux
pnpm import:games

# 7. Importer les 1025 Pokémon depuis PokeAPI
pnpm import:pokemon
# ou par générations :
pnpm import:pokemon x # avec x [ 1-9 ]

# 8. Lancer le serveur de dev
pnpm dev

# 9. (Optionnel) Reset les status des pokemons
pnpm import:status # pour tous
pnpm import:status x # avec x [ 1-9 ]
```

Accès : http://localhost:3000

## Commandes utiles

| Commande              | Description                         |
|-----------------------|-------------------------------------|
| `pnpm dev`            | Serveur de développement            |
| `pnpm build`          | Build production                    |
| `pnpm prisma:studio`  | Interface Prisma Studio             |
| `pnpm import:pokemon` | Import des Pokémon depuis PokeAPI   |
| `pnpm import:status`  | Reload la table statut              |
| `pnpm import:games`   | Import tous les Jeux depuis PokeAPI |
