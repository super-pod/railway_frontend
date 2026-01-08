# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && ls -R dist

# Production stage
FROM node:20-slim
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
# Railway provides the PORT environment variable
CMD echo "Starting server on port $PORT..." && serve -s dist -l $PORT
