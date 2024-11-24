# Step 1: Use Node.js official image as base
FROM node:20-slim

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application files to the container
COPY . .

# Step 6: Expose the port the app will run on (443 for HTTPS or 3000 for HTTP)
EXPOSE 3000

# Step 7: Set environment variables if needed (you can use docker secrets or env files for sensitive data)

# Step 8: Start the Express server
CMD ["node", "index.js"]
