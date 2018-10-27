const envalid = require('envalid');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const expressLogger = require('express-bunyan-logger');

const routes = require('./routes');

// get config from ENV VARs
const config = envalid.cleanEnv(process.env, {
  HTTP_PORT: envalid.num({ default: 3000 }),
}, { strict: true });

// create the app object
const app = express();

// add middleware(s)
app.use(expressLogger());
app.use(bodyParser.json());
app.use('/', routes());

// Create the server and start it...
const server = http.createServer(app);

function start() {
  server.listen(config.HTTP_PORT, (err) => {
    if (err) {
      console.error(`error starting app: ${err}`); // eslint-disable-line no-console
    } else {
      console.log('app started...'); // eslint-disable-line no-console
    }
  });
}

if (!module.parent) {
  start();
}

module.exports = {
  app,
  start,
};
