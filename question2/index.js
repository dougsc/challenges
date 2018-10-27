#!/usr/bin/env node
/* eslint-disable no-console */
const lib = require('./lib');

// parse the command-line options
const commandOptions = lib.parseCommandArgs(process.argv.splice(2));

// load the product / price data
lib.loadProductPriceData(commandOptions.filename, (data) => {
  const result = lib.findProducts(data, commandOptions.cardValue, commandOptions.threeFriends);
  if (result.items) {
    console.info(`found the following ${result.items.length} items and spent ${commandOptions.cardValue - result.leastChange} of ${commandOptions.cardValue} cents`);
    console.dir(result.items);
  } else {
    console.warn(`failed to find any ${commandOptions.threeFriends ? 'three' : 'two'} products for ${commandOptions.cardValue} cents`);
  }
});
