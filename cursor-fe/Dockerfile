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
RUN rm -rf .git

# Production stage - Install and clean dependencies in Alpine, then copy to distroless
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install pnpm
RUN npm install -g pnpm@latest

# Install ONLY production dependencies and clean aggressively
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
    rm -rf /root/.local /root/.npm /root/.pnpm-store /root/.cache /tmp/*

# Final production stage - Distroless (no shell, minimal)
FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app

# Copy cleaned node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built dist from builder
COPY --from=builder /app/dist ./dist

# Copy custom serve server
COPY serve.js ./serve.js

ENV NODE_ENV=production
EXPOSE 4173

# Health check using busybox (available in distroless)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD ["/busybox/sh", "-c", "wget --no-verbose --tries=1 --spider http://localhost:4173 || exit 1"]

# Run custom static server
CMD ["serve.js"]