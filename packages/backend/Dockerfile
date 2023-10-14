FROM node:lts-slim

# Do some updating
RUN apt-get update && apt-get install -y

# Copy some stuff
RUN mkdir app
WORKDIR /app
COPY ./packages/backend/ .

# Install stuff
RUN npm install
# Debug stuff
RUN ls -la

# Build stuff
RUN npm run build


RUN rm -rf node_modules
RUN npm install --omit=dev

# Remove unneeded files
RUN rm -rf src

# Install ffmpeg
RUN apt install -y ffmpeg

EXPOSE 8080

# Startup command
CMD ["npm", "run", "start"]


