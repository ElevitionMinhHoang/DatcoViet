# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
