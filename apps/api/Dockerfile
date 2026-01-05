FROM node:20-alpine

WORKDIR /app

# Copy root config
COPY package*.json tsconfig.base.json ./

# Copy packages
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies
RUN npm install

# Build shared
RUN npm run build --workspace=packages/shared

# Generate Prisma
WORKDIR /app/apps/api
RUN npx prisma generate

# Build API
WORKDIR /app
RUN npm run build --workspace=apps/api

WORKDIR /app/apps/api
EXPOSE 3001

CMD ["npm", "start"]
