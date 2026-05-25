FROM node:22-alpine

WORKDIR /app

RUN corepack enable

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]