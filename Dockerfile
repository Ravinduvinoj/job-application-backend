FROM node:20
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies and fix vulnerabilities
RUN npm ci --omit=dev && npm audit fix --omit=dev

# Optionally, update npm to the latest version
RUN npm install -g npm@10.9.2

# Copy application files
COPY . .

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
