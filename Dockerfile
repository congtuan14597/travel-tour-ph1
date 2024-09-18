# Use Node.js base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Copy the Google Cloud credentials file
COPY google_auth.json /usr/src/app/

# Expose the port from the .env
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
