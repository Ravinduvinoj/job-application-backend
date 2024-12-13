FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
