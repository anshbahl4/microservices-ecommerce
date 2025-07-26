FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the code and build React app
COPY . .
RUN npm run build

# Install `serve` to serve static files
RUN npm install -g serve

EXPOSE 3000

# Use `serve` to serve build folder
CMD ["serve", "-s", "build", "-l", "3000"]
