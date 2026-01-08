# Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Install deps INCLUDING devDependencies
COPY package*.json ./
RUN npm install --include=dev

# Build
COPY . .
RUN npm run build

# Production stage (static file server)
FROM node:20-slim
WORKDIR /app

RUN npm install -g serve

# Copy built assets only
COPY --from=builder /app/dist ./dist

# PORT is provided by Railway; default to 3000 for local runs
ENV NODE_ENV=production
CMD sh -c 'serve -s dist --listen 0.0.0.0:${PORT:-3000}'
