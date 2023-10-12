FROM node:lts-slim

RUN apt-get update && apt-get install -y

# Install ffmpeg
RUN apt install -y ffmpeg

# Copy some stuff
RUN mkdir app
WORKDIR /app
COPY . .

# Build stuff
RUN npm install
RUN npm run build

RUN rm -rf node_modules
RUN npm install --omit=dev

# Remove unneeded files
RUN rm -rf src

EXPOSE 8080

CMD ["npm", "run", "start"]


