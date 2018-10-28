const express = require('express');
const crypto = require('crypto');
const _ = require('lodash');

const router = express.Router();
const messages = {};

/**
 * Generate a SHA256 hash of the message and store the hash / message
 * pair
 * @param {string} message
 */
const newMessage = (message) => {
  const hash = crypto.createHash('sha256').update(message).digest('hex');
  messages[hash] = message;
  return hash;
};

/**
 * Return the message stored against the provided
 * hash key (or undefined if none exists)
 * @param {string} sha256Hash
 */
const messageFromSha = sha256Hash => messages[sha256Hash];

/**
 * Handler for GET /messages
 * @param {object} req
 * @param {object} res
 */
const getMessage = (req, res) => {
  const message = messageFromSha(req.params.hash);
  if (message) {
    res.send({ message });
  } else {
    // if the requested message is not available
    // return a 404
    res.status(404).send({
      err_msg: 'Message not found',
    });
  }
};

/**
 * Handler for POST /messages
 * The caller must provide a message paramter in the
 * JSON body or a 400 response will be sent
 * @param {object} req
 * @param {object} res
 */
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
  router.get('/health', (req, res) => res.send({ healthy: true }));
  return router;
};
