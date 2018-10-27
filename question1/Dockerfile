FROM node:8.12-alpine

RUN mkdir -p /var/app
WORKDIR /var/app

COPY . /var/app

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]
