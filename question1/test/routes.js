// test packages
const expect = require('chai').expect;
const request = require('supertest');

// Module under test
const appObj = require('../index.js');

const app = appObj.app;
const testMessagePair = {
  message: 'test1',
  digest: '1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d83567014',
};

describe('health check', () => {
  it('responds ok', (done) => {
    request(app)
      .get('/health')
      .expect(200)
      .end(done);
  });
});

describe('messages', () => {
  context('POST /messages', () => {
    it('returns 400 if message is not provided', (done) => {
      request(app)
        .post('/messages')
        .send({ invlaidkey: true })
        .expect(400, (err, result) => {
          expect(result.body).to.deep.equal({ err_msg: 'message missing or empty' });
          done();
        });
    });
    it('returns sha256 hash for message', (done) => {
      request(app)
        .post('/messages')
        .send({ message: testMessagePair.message })
        .expect(200, (err, result) => {
          expect(result.body).to.deep.equal({ digest: testMessagePair.digest });
          done();
        });
    });
  });

  context('GET /messages', () => {
    it('returns 404 if message not found', (done) => {
      request(app)
        .get('/messages/unknown-hash')
        .expect(404)
        .end(done);
    });
    it('returns message for existing hash', (done) => {
      request(app)
        .get(`/messages/${testMessagePair.digest}`)
        .expect(200, (err, result) => {
          expect(result.body).to.deep.equal({ message: testMessagePair.message });
          done();
        });
    });
  });
});
