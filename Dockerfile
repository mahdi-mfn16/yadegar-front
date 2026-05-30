# Development
FROM node:18-alpine AS development
WORKDIR /app


COPY package*.json ./
RUN npm install

# کپی کد پروژه
COPY . .

# hot-reload activation
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Production
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Production runtime
FROM node:18-alpine AS production
WORKDIR /app

COPY package*.json ./ 
RUN npm install --production

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
