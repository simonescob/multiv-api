# Multi-stage production build
# Docker is used only for production deployment (e.g., Railway)
# Local development should use: npm run dev

# Stage 1: Install production dependencies
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build application
FROM node:18-alpine AS build
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code
COPY . .

# Copy babel configuration
COPY src/.babelrc ./

# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /usr/src/app/dist ./dist
COPY --from=deps --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /usr/src/app/package.json ./

# Copy public uploads directory if exists
COPY --chown=nodejs:nodejs src/public ./src/public

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Production command
CMD ["npm", "start"]