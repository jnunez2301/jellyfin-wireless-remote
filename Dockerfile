FROM docker.io/oven/bun:slim

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "start"]