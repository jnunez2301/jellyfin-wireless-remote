# -----------------------
# Build stage
# -----------------------
FROM docker.io/oven/bun:slim AS base

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY bun.lock package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY . .

#Environment
ARG VITE_JELLYFIN_DEFAULT_HOST
ARG VITE_JELLYFIN_DEFAULT_USERNAME
ARG VITE_JELLYFIN_DEFAULT_PASSWORD

ENV VITE_JELLYFIN_DEFAULT_HOST=$VITE_JELLYFIN_DEFAULT_HOST
ENV VITE_JELLYFIN_DEFAULT_USERNAME=$VITE_JELLYFIN_DEFAULT_USERNAME
ENV VITE_JELLYFIN_DEFAULT_PASSWORD=$VITE_JELLYFIN_DEFAULT_PASSWORD

# Build the Vite app
RUN bun run build

# -----------------------
# Runtime stage
# -----------------------
FROM docker.io/oven/bun:slim AS runner

WORKDIR /app

# Copy only built files
COPY --from=base /app/dist ./dist

# Install serve globally
RUN bun add --global serve

# Expose port
EXPOSE 3000

# Run with dedicated user
USER 1000

# Run the app
CMD ["bunx", "serve", "-s", "dist", "-l", "3000"]
