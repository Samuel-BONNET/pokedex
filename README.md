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

# 5. (Optionnel) Créer l'admin
pnpm prisma:seed

# 6. (Optionnel) Importer les 1025 Pokémon depuis PokeAPI
pnpm import:pokemon

# 7. Lancer le serveur de dev
pnpm dev
```

Accès : http://localhost:3000

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build production |
| `pnpm prisma:studio` | Interface Prisma Studio |
| `pnpm import:pokemon` | Import des Pokémon depuis PokeAPI |
