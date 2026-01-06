FROM oven/bun:1 AS base
WORKDIR /app
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
ARG STRIPE_SECRET_KEY="sk_test_placeholder"
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_placeholder"
ARG CLERK_SECRET_KEY="sk_test_placeholder"
ENV DATABASE_URL=${DATABASE_URL} \
    STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} \
    CLERK_SECRET_KEY=${CLERK_SECRET_KEY} \
    NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN bun run build

FROM base AS runner-deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile --production

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=runner-deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
USER bun
CMD ["bun", "run", "start"]
