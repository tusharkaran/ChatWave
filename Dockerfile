# Use official Node.js image as base
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json for backend
COPY package.json .

# Install backend dependencies
RUN npm install

# Set working directory for backend
WORKDIR /app/backend

# Copy backend files
COPY backend/ .

# Set working directory for frontend
WORKDIR /app/frontend

# Copy package.json for frontend
COPY frontend/package.json .

# Install frontend dependencies
RUN npm install

# Copy frontend files
COPY frontend/ .

# Expose backend port
EXPOSE 8080

# Expose frontend port
EXPOSE 3000

# Command to start both backend and frontend
CMD ["npm", "run", "start"]
