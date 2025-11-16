# syntax=docker/dockerfile:1.7

# ---- Base versions ----
ARG NODE_VERSION=20.18.0

# ---- 1) Install deps layer ----
FROM node:${NODE_VERSION}-alpine AS deps
ENV CI=true
RUN npm install -g pnpm@latest
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Install production and dev deps for build
RUN pnpm install --no-frozen-lockfile

# ---- 2) Build ----
FROM node:${NODE_VERSION}-alpine AS builder
ENV CI=true
RUN npm install -g pnpm@latest
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy .env.production if it exists (Next.js will automatically load it when NODE_ENV=production)
# Build Next.js (standalone output)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- 3) Runtime (standalone) ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]


