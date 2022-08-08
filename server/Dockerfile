FROM node:14-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY package*.json ./

# Change the NPM package directory
USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

COPY --chown=node:node . .

RUN npm install --quiet --no-progress -g ts-node typescript
RUN npm install
RUN npm run build
RUN npm run populate

EXPOSE 3000

CMD ["npm", "run", "start"]