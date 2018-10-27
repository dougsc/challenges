const express = require('express');
const crypto = require('crypto');
const _ = require('lodash');

const router = express.Router();
const messages = {};

const newMessage = (message) => {
  const hash = crypto.createHash('sha256').update('foo').digest('hex');
  messages[hash] = message;
  return hash;
};

const messageFromSha = sha256Hash => messages[sha256Hash];

const getMessage = (req, res) => {
  const message = messageFromSha(req.params.hash);
  if (message) {
    res.send({ message });
  } else {
    res.status(404).send({
      err_msg: 'Message not found',
    });
  }
};

const postMessage = (req, res) => {
  const { message } = req.body;
  if (_.isEmpty(message)) {
    res.status(400).send({
      err_msg: 'message missing or empty',
    });
  } else {
    const digest = newMessage(message);
    res.send({ digest });
  }
};

module.exports = () => {
  router.get('/messages/:hash', getMessage);
  router.post('/messages', postMessage);
  return router;
};
