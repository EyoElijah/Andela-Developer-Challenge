import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

//Assertion style
chai.should();
chai.use(chaiHttp);

let request;
beforeEach(() => {
  request = chai.request(app);
});

const userDetails = {
  email: 'bola@gmail.com',
  password: 'bola1234',
};

let userToken;
let userId;

describe('GET User Route', () => {
  describe('GET /api/v1/users/:userId/parcels', async () => {
    before(async () => {
      try {
        const res = await chai
          .request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = res.body.data.token;
        userId = res.body.data.user.id;
      } catch (error) {
        console.error('Before Each Error msg:', error.message);
      }
    });

    it('should return error if no token is present', async () => {
      const res = await request.get(`/api/v1/users/${userId}/parcels`);
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql(401);
      res.body.should.have.property('error').eql('no token present');
    });

    it('should Not work when a user is not permitted to access the route', async () => {
      const userId = 2;
      const res = await request
        .get(`/api/v1/users/${userId}/parcels`)
        .set('authorization', `Bearer ${userToken}`);

      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql(401);
      res.body.should.have.property('message').eql('cannot access this route');
    });

    it('shoud return all the parcels placed by that particular user', async () => {
      const userId = 1;
      const res = await request
        .get(`/api/v1/users/${userId}/parcels`)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(200);
      res.body.should.have.property('status').eql(200);
      res.body.data.should.be.a('array');
    });

    it('should return no parcel has been placed by that user', async () => {
      const userId = 10;
      const res = await request
        .get(`/api/v1/users/${userId}/parcels`)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('message');
    });

    it('should return no user with that id', async () => {
      const userId = 64;
      const res = await request
        .get(`/api/v1/users/${userId}/parcels`)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('message');
    });

    it('It SHOULD NOT work if id is not a number', async () => {
      const userId = '1xae4rg2';
      const res = await request
        .get(`/api/v1/users/${userId}/parcels`)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(500);
      res.body.should.have.property('error');
    });
  });
});
