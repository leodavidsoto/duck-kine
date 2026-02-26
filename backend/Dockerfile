FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files and install ALL deps (dev deps needed for prisma generate)
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend/ .

# Generate Prisma client
RUN npx prisma generate

# Remove dev dependencies to slim down
RUN npm prune --omit=dev

EXPOSE 4000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
