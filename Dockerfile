FROM node:lts-bullseye-slim

RUN npm install -g pm2

USER node

RUN mkdir -p /home/node/code/node_modules && chown -R node:node /home/node/code

WORKDIR /home/node/code

EXPOSE 3000
