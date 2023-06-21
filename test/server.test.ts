import * as chai from 'chai';
import supertest from 'supertest';
import app from '../app/server/server';

const expect = chai.expect;
const request = supertest(app);

describe('Server Test', () => {
  it('Should return "Hello, World!"', async () => {
    const response = await request.get('/');
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Hello, World!');
  });
});
