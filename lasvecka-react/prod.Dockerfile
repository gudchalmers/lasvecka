FROM node:latest AS build-step

RUN mkdir -p /usr/src/lasveckor/frontend
RUN chown -R node /usr/src/lasveckor/frontend

USER node

WORKDIR /usr/src/lasveckor/frontend

COPY . .
COPY ["package.json", "./"]

RUN yarn upgrade
RUN yarn install
RUN yarn global add react-scripts
RUN yarn build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build-step /usr/src/lasveckor/frontend/build /usr/share/nginx/html
