# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build the web version of the app
RUN npx expo export --platform web

# Install static file server
RUN npm install -g serve

# Expose port Render will use
EXPOSE 3000

# Serve the web build
CMD ["serve", "-s", "dist", "-l", "3000"]
