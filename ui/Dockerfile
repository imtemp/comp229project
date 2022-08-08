FROM node:14-alpine

RUN mkdir -p /ui/node_modules && chown -R node:node /ui

WORKDIR /ui

COPY *.json ./

USER node

COPY --chown=node:node . .

RUN npm install @angular/cli
RUN npm install
RUN npm run ng build -- --prod
