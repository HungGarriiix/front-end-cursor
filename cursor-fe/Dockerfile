FROM node:22-alpine AS builder
WORKDIR /app

# Build arguments for environment variables
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_WEBHOOK_URL
ARG VITE_IMAGE_WEBHOOK_URL
ARG VITE_API_BASE_URL

# Export as environment variables for build
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_WEBHOOK_URL=$VITE_WEBHOOK_URL
ENV VITE_IMAGE_WEBHOOK_URL=$VITE_IMAGE_WEBHOOK_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Install pnpm
RUN npm install -g pnpm@latest

# Copy manifests
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install everything (needed for build tools)
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# Clean build artifacts
RUN rm -rf .git node_modules

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install ONLY production dependencies and clean aggressive
RUN pnpm install --frozen-lockfile --prod --shamefully-hoist && \
    # Prune pnpm store to remove unused dependencies
    pnpm prune --prod && \
    # Remove all markdown, maps, test files, and dev-related files
    find /app/node_modules -type f \( \
    -name "*.md" -o -name "*.map" -o -name "*.test.*" -o -name "*.spec.*" -o \
    -name "*.d.ts" -o -name "*.d.ts.map" \
    \) -delete 2>/dev/null || true && \
    # Remove unnecessary directories
    find /app/node_modules -type d \( \
    -name ".git" -o -name "test" -o -name "tests" -o -name "__tests__" -o \
    -name "docs" -o -name "examples" -o -name ".github" -o -name "fixtures" \
    \) -exec rm -rf {} + 2>/dev/null || true && \
    # Clean cache
    rm -rf /root/.local /root/.npm /root/.pnpm-store /root/.cache

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Copy custom serve server
COPY serve.js ./serve.js

ENV NODE_ENV=production
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run custom static server
CMD ["node", "serve.js"]