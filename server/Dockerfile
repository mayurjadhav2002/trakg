# ---- Stage 1: Build TypeScript ----
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git bash

# Accept token as build arg
ARG GH_NPM_TOKEN
ENV GH_NPM_TOKEN=${GH_NPM_TOKEN}

# Setup npmrc for GitHub Packages
COPY .npmrc .npmrc
RUN npm config set //npm.pkg.github.com/:_authToken=${GH_NPM_TOKEN}

# Install deps deterministically
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of the app and build
COPY . .
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:20-alpine AS runtime   

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 8000
CMD ["node", "dist/src/index.js"]
