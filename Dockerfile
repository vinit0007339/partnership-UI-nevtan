# syntax=docker/dockerfile:1
#
# Build:  docker build --build-arg APP_ENV=prod -t nevtan-partner-ui .
# Run:    docker run -p 3000:3000 nevtan-partner-ui

# ── deps ───────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── build ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Which .env.<profile> file the build reads: localhost | stage | prod.
ARG APP_ENV=prod

# NEXT_PUBLIC_* is compiled into the bundle by `next build` and never read at runtime, so
# setting it on the running container has no effect — it has to be decided here. Any of
# these passed as a build arg wins over the value in .env.<APP_ENV>; left unset, the
# file's value is used (scripts/next-with-env.mjs only fills keys that are empty).
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID \
    NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run "build:$APP_ENV"

# ── runtime ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# `output: "standalone"` (next.config.mjs) emits the server and only the node_modules it
# uses, but copies neither public/ (logos, favicon, product icons) nor .next/static (JS/CSS
# chunks). Both are copied here explicitly, or every asset 404s.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
