FROM docker.io/oven/bun:slim

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "dev", "--port", "3000", "--host", "0.0.0.0"]