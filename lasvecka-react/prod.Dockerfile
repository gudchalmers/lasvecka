FROM node:17 AS build-step

RUN mkdir -p /usr/src/lasveckor/frontend
RUN chown -R node:node /usr/src/lasveckor/frontend

USER root

WORKDIR /usr/src/lasveckor/frontend

COPY . .
COPY ["package.json", "./"]

RUN yarn install 
RUN yarn upgrade --latest
RUN yarn global add react-scripts
RUN yarn build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
COPY --from=build-step /usr/src/lasveckor/frontend/build /usr/share/nginx/html
