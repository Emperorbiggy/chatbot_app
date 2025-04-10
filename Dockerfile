# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the web version of the Expo app
RUN npm run web-build

# Install a simple static server
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Serve the built static files
CMD ["serve", "-s", "web-build", "-l", "3000"]
