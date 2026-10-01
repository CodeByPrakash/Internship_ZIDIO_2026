# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install OpenSSL and build utilities for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy dependency manifests & prisma schema first for cache optimization
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies like typescript & prisma CLI)
RUN npm ci

# Copy full application source code
COPY . .

# Generate Prisma Client & compile TypeScript to dist/
RUN npx prisma generate
RUN npm run build

# ─── Production Stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Install OpenSSL runtime dependency for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package manifests & prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ONLY production dependencies and generate runtime Prisma Client
RUN npm ci --only=production
RUN npx prisma generate

# Copy compiled JavaScript output from builder stage
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

USER node

CMD ["node", "dist/index.js"]
