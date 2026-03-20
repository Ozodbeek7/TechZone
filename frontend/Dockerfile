# Development image: React dev server on port 3000 (used by docker-compose + nginx).
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

EXPOSE 3000

# File watching inside Docker Desktop / Windows volumes
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["npm", "start"]
