# Multi-stage build for production
FROM node:20-alpine AS builder

# Install build dependencies for Prisma
RUN apk add --no-available --sync openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

# Install runtime dependencies for Prisma
RUN apk add --no-available --sync openssl libc6-compat

WORKDIR /app

# Copy built assets and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.prod.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start command
CMD ["npm", "start"]
