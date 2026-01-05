FROM node:20-alpine

WORKDIR /app

# Copy root config
COPY package*.json tsconfig.base.json ./

# Copy packages
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# Install dependencies
RUN npm install

# Build shared
RUN npm run build --workspace=packages/shared

# Build Web
WORKDIR /app
ENV NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
RUN npm run build --workspace=apps/web

WORKDIR /app/apps/web
EXPOSE 3000

CMD ["npm", "start"]
