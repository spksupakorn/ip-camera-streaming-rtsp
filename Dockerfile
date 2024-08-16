FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Setting working directory
WORKDIR /app

# Copying package.json and package-lock.json
COPY package*.json ./

# Installing dependencies
RUN npm install

# Install FFmpeg. This is needed to convert the video to HLS
RUN apk add --no-cache ffmpeg

# /usr/bin/ffmpeg is the default path for ffmpeg, copy it to /app
RUN cp /usr/bin/ffmpeg ./

# Copying all the files
COPY . .

# Exposing ports
EXPOSE 8000
EXPOSE 9999

# Running the app
CMD ["node", "server.js"]