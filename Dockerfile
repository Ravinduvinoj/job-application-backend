FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
