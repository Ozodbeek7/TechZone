# Production image for Railway (and static hosting). Listens on 0.0.0.0:$PORT for healthchecks.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Railway: set REACT_APP_API_URL in service variables (add to Docker build if prompted).
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g serve@14.2.4

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["sh", "-c", "serve -s build -l tcp://0.0.0.0:${PORT:-3000}"]
