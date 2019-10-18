FROM node:carbon-alpine as dist
WORKDIR /tmp/
COPY package.json yarn.lock tsconfig* ./
COPY .env ./
COPY src/ src/
RUN yarn install
RUN yarn run build

FROM node:carbon-alpine as node_modules
WORKDIR /tmp/
COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:carbon-alpine
WORKDIR /usr/local/api
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
COPY --from=dist /tmp/.env  ./

EXPOSE 3002:3002
CMD ["node", "dist/main.js"]