FROM node:8.12-alpine

RUN mkdir -p /var/app
WORKDIR /var/app

# copy in everything from the workspace
# You must run npm install in the workspace before
# running docker build ...
COPY . /var/app

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]
