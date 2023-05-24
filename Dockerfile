FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json

COPY . .

# Install dependencies
RUN npm install

# Copy the rest of the application code

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD [ "npm", "start" ]
