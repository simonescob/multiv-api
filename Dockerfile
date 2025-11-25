# Multi-stage build for better optimization

# Stage 1: Dependencies installation
FROM node:18-alpine AS deps
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Development build
FROM node:18-alpine AS dev
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Copy babel configuration
COPY src/.babelrc ./

# Expose port
EXPOSE 8000

# Development command
CMD ["npm", "run", "dev"]

# Stage 3: Production build
FROM node:18-alpine AS build
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Copy babel configuration
COPY src/.babelrc ./

# Build the application
RUN npm run build

# Stage 4: Production runtime
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

# Default stage (can be overridden with --target)
FROM production AS default