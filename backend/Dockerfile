FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install socket.io
RUN npm install
RUN npm install ioredis
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
