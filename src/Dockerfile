
# Use Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build React application
RUN npm run build

# Install static file server
RUN npm install -g serve

# Expose application port
EXPOSE 3000

# Start the React application
CMD ["serve", "-s", "dist", "-l", "3000"]
