# Use official Node.js LTS light runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install application dependencies
RUN npm install --only=production

# Copy application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start Tax Calculator web application
CMD ["npm", "start"]

