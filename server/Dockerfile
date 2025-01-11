# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY /package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY / .

# Build the TypeScript code
RUN npm run build

# Use a smaller image for the final stage
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/
# Copy the migration files from the build stage
COPY --from=build /app/drizzle /app/drizzle


# Install only production dependencies

# Expose the port the app runs on
EXPOSE 3002

# Define the command to run the app
CMD ["node", "dist/index.js"]
