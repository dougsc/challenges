// test packages
const expect = require('chai').expect;
const _ = require('lodash');

// Module under test
const lib = require('../lib');

const testProducts1 = [
  { product: 'a', price: 1 },
  { product: 'b', price: 2 },
  { product: 'c', price: 3 },
  { product: 'd', price: 4 },
  { product: 'e', price: 6 },
  { product: 'f', price: 9 },
  { product: 'g', price: 15 },
];

describe('findTwoProducts', () => {
  it('returns null items on failure to find a pair', () => {
    const result = lib.findTwoProducts(testProducts1, 2);
    expect(result).to.deep.equal({
      items: null,
      leastChange: 2,
    });
  });
  it('returns minimum exact pair', () => {
    const result = lib.findTwoProducts(testProducts1, 3);
    expect(result).to.deep.equal({
      items: [{ product: 'a', price: 1 }, { product: 'b', price: 2 }],
      leastChange: 0,
    });
  });
  it('returns first exact pair', () => {
    const result = lib.findTwoProducts(testProducts1, 5);
    expect(result).to.deep.equal({
      items: [{ product: 'a', price: 1 }, { product: 'd', price: 4 }],
      leastChange: 0,
    });
  });
  it('returns closest pair', () => {
    const result = lib.findTwoProducts(testProducts1, 14);
    expect(result).to.deep.equal({
      items: [{ product: 'd', price: 4 }, { product: 'f', price: 9 }],
      leastChange: 1,
    });
  });
});

describe('findThreeProducts', () => {
  it('returns null items on failure to find a trio', () => {
    const result = lib.findThreeProducts(_.cloneDeep(testProducts1), 5);
    expect(result).to.deep.equal({
      items: null,
      leastChange: 5,
    });
  });
  it('returns first exact trio', () => {
    const result = lib.findThreeProducts(_.cloneDeep(testProducts1), 6);
    expect(result).to.deep.equal({
      items: [{ product: 'a', price: 1 }, { product: 'b', price: 2 }, { product: 'c', price: 3 }],
      leastChange: 0,
    });
  });
  it('returns closest trio', () => {
    const result = lib.findThreeProducts(_.cloneDeep(testProducts1), 29);
    expect(result).to.deep.equal({
      items: [{ product: 'd', price: 4 }, { product: 'f', price: 9 }, { product: 'g', price: 15 }],
      leastChange: 1,
    });
  });
});
