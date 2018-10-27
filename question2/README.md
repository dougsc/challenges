# Question 2

The time complexity of the algorithm for selecting 2 gifts is linear or `O(n)`.

The three gift algorithm has a worst case complexity of `O(n^2)`. 

## Usage

After cloning this repository first install the dependencies (requires node:8 or later)...

```bash
npm install
```

Then you can execute the `gifts` command as follows:

```bash
Usage gifts <product / price file path> <gift card value (cents)> [options]

Options:
  --three          Find three gifts
```

For example:

```bash
>> ./gifts test-data/prices.txt 10000
found the following 2 items and spent 8000 of 10000 cents
[ { product: 'Earmuffs', price: 2000 },
  { product: 'Bluetooth Stereo', price: 6000 } ]
```

or, to find 3 gifts...

```bash
>> ./gifts test-data/prices.txt 10000 --three
found the following 3 items and spent 9400 of 10000 cents
[ { product: 'Headphones', price: 1400 },
  { product: 'Earmuffs', price: 2000 },
  { product: 'Bluetooth Stereo', price: 6000 } ]
```

You can run lint, test and test coverage using the following commands:

```bash
npm run lint
npm run test
npm run test:cover
```




