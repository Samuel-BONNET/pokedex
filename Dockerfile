FROM node:22-alpine

WORKDIR /app

RUN corepack enable

ENV CI=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

COPY scripts/entrypoint.sh /app/scripts/entrypoint.sh
RUN chmod +x /app/scripts/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]