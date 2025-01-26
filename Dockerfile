# Stage 1: Build
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . ./

# Build the Vite app
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy the built files from the previous stage to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
