// test packages
const expect = require('chai').expect;

// Module under test
const lib = require('../lib');

describe('findTwoProducts', () => {
  it('returns null items on failure to find a pair', () => {
    const result = lib.findTwoProducts([
      { product: 'a', price: '1' },
      { product: 'b', price: '2' },
    ], 1);
    expect(result).to.deep.equal({
      items: null,
      leastChange: 1,
    });
  });
});
