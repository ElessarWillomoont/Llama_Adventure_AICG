# Use a lightweight Node.js image for production
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Use the optimized production build
CMD ["npm", "start"]
