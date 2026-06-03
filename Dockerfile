# Development
FROM node:20-alpine AS development
WORKDIR /app

# فقط package.json (نه lockfile) تا npm برای پلتفرم Linux نصب کنه
COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Production Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Runtime
FROM node:20-alpine AS production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./

EXPOSE 3000
CMD ["npm", "start"]
