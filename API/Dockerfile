FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma@6 generate

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
