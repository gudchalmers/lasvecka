FROM node:17

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn upgrade --latest

CMD yarn start

EXPOSE 3000
