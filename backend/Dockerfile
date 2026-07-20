# Use Node Alpine base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend source files
COPY . .

# Expose API port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
