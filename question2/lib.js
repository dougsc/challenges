const minimist = require('minimist');
const fs = require('fs');
const parse = require('csv-parse');
const _ = require('lodash');
const Joi = require('joi');

function error(message) {
  console.error(message); // eslint-disable-line no-console
  process.exit(1);
}

function parseCommandArgs(rawArgs) {
  const usageStr = `
Usage gifts <product / price file path> <gift card value (cents)> [options]
  
Options:
  --three          Find three gifts
`;

  const argv = minimist(rawArgs);

  const [filename, cardValue] = argv._;
  if (!fs.existsSync(filename)) {
    error(`Could not find filename: ${filename} ${usageStr}`);
  }
  if (!_.isInteger(cardValue) || cardValue < 1) {
    error(`Card value must be an integer that is greater than zero: ${cardValue} ${usageStr}`);
  }
  return {
    filename,
    cardValue,
    threeFriends: !!argv.three,
  };
}

/**
 * Load product / price data from a CSV file and format it
 * into an Array of objects
 * @param {string} filename
 * @param {function} cb - called with the object Array
 */
function loadProductPriceData(filename, cb) {
  const rawData = fs.readFileSync(filename);
  parse(rawData, {
    trim: true,
    cast: true,
    columns: ['product', 'price'],
  }, (err, data) => {
    if (err) return error(`failed to parse CSV file ${filename}, error: ${err}`);
    return cb(data);
  });
}

function findTwoProducts(productData, giftCardValue) {
  let leftIndex = 0;
  let rightIndex = productData.length - 1;
  let leastChange = giftCardValue;
  let items = null;

  while (leftIndex < rightIndex) {
    // calculate the change received from purchasing the two items
    // (will be a negative number if the card has insufficient funds)
    const change = (giftCardValue - (productData[leftIndex].price + productData[rightIndex].price));
    // if the card has enough value to buy the items AND if the change leftover is the
    // smallest amount so far - update the stored least change and the items
    if (change >= 0 && change < leastChange) {
      leastChange = change;
      items = [productData[leftIndex], productData[rightIndex]];
    }

    // if we had change left over look for a more expensive combo (by incrementing the left index)
    if (change > 0) {
      leftIndex += 1;
    } else if (change < 0) {
      // if we overspent look for a cheaper combo...
      rightIndex -= 1;
    } else {
      // exactly right, stop looking
      break;
    }
  }
  return {
    items,
    leastChange,
  };
}

function findThreeProducts(productData, giftCardValue) {
  let leastChange = giftCardValue;
  let items = null;

  // keep searching while there are:
  // 1 - still 3 products left in the list
  // 2 - no exact match for gift card value
  while (productData.length > 2 && leastChange > 0) {
    const thirdProduct = productData.pop();
    const remainingCardValue = giftCardValue - thirdProduct.price;

    // if the third product is less than the card value...
    if (remainingCardValue > 0) {
      const twoProductResult = findTwoProducts(productData, remainingCardValue);
      if (twoProductResult.items && twoProductResult.leastChange < leastChange) {
        // best combination so far...
        [leastChange, items] = [
          twoProductResult.leastChange,
          twoProductResult.items.concat(thirdProduct),
        ];
      }
    }
  }
  return {
    items,
    leastChange,
  };
}

/**
 * Check if product / price data is valid
 *  - check the minimum number of products exist (2 or 3)
 *  - check that all prices are > 0
 * @param {Array} data
 * @param {Boolean} threeGifts
 */
function validateProductData(data, threeGifts) {
  const minimumProducts = threeGifts ? 3 : 2;
  const schema = Joi.array().items(
    Joi.object().keys({
      product: Joi.string().min(1).required(),
      price: Joi.number().positive().required(),
    }),
  ).min(minimumProducts);
  return Joi.validate(data, schema);
}

/**
 * Main entry point for finding list of products
 * @param {Array} productData
 * @param {Number} giftCardValue
 * @param {Boolean} threeGifts
 */
function findProducts(productData, giftCardValue, threeGifts) {
  const result = validateProductData(productData, threeGifts);
  if (result.error) return error(`Validation of product data failed: ${result.error}`);

  return (threeGifts) ? findThreeProducts(result.value, giftCardValue)
    : findTwoProducts(result.value, giftCardValue);
}

module.exports = {
  parseCommandArgs,
  loadProductPriceData,
  findProducts,
  findTwoProducts,
  findThreeProducts,
};
