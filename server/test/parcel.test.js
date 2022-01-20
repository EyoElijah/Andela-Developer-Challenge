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
  email: 'rex@gmail.com',
  password: 'rex1234',
};

let userToken;
let userId;

describe('parcel routes', () => {
  describe('POST CREATE PARCEL api/v1/parcels', () => {
    before(async () => {
      try {
        const res = await chai
          .request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = res.body.data.token;
        // userId = res.body.data.user.id;
      } catch (error) {
        console.error('Before Each Error msg:', error.message);
      }
    });

    it('should not create parcel if no token is present', async () => {
      const parcelDetails = {
        weight: 23.2,
        weight_metric: '40kg',
        from: 'maitama',
        to: 'gwarinpa',
        currentLocation: 'kubwa',
      };
      const res = await request.post('/api/v1/parcels').send(parcelDetails);
      res.should.have.status(401);
      res.body.should.have.property('status');
      res.body.should.have.property('status').eql(401);
      res.body.should.be.a('object');
    });

    it('Should not create parcel if the weight field is omitted', async () => {
      const parcelDetails = {
        weight: '',
        weight_metric: '40kg',
        from: 'maitama',
        to: 'gwarinpa',
        currentLocation: 'kubwa',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('status').eql(400);
      res.body.should.be.a('object');
    });

    it('Should not create parcel if the weight metric field is omitted', async () => {
      const parcelDetails = {
        weight: 32.3,
        weight_metric: '',
        from: 'maitama',
        to: 'gwarinpa',
        currentLocation: 'kubwa',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('status').eql(400);
      res.body.should.be.a('object');
    });

    it('Should not create parcel if the from address field is omitted', async () => {
      const parcelDetails = {
        weight: 23.2,
        weight_metric: '40kg',
        from: '',
        to: 'gwarinpa',
        currentLocation: 'kubwa',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('status').eql(400);
      res.body.should.be.a('object');
    });

    it('Should not create parcel if the to address field is omitted', async () => {
      const parcelDetails = {
        weight: 32.3,
        weight_metric: '40kg',
        from: 'maitama',
        to: '',
        currentLocation: 'kubwa',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('status').eql(400);
      res.body.should.be.a('object');
    });

    it('Should not create parcel if the current location field is omitted', async () => {
      const parcelDetails = {
        weight: 343.3,
        weight_metric: '40kg',
        from: 'maitama',
        to: 'gwarinpa',
        currentLocation: '',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(400);
      res.body.should.have.property('status').eql(400);
      res.body.should.be.a('object');
    });

    it('Should create parcel when all feilds are present', async () => {
      const parcelDetails = {
        weight: 343.3,
        weight_metric: '50kg',
        from: 'zuba Road',
        to: 'mandala',
        currentLocation: 'shelter farm',
      };
      const res = await request
        .post('/api/v1/parcels')
        .send(parcelDetails)
        .set('authorization', `Bearer ${userToken}`);
      res.should.have.status(201);
      res.body.should.have.property('status').eql(201);
      res.body.should.be.a('object');
    });

    describe('GET get All parcels api/v1/parcels', () => {
      it('should not get all parcel if no token is present', async () => {
        const res = await request.get('/api/v1/parcels');
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql(401);
        res.body.should.have.property('error').eql('no token present');
      });

      it('should not get all parcel if the user is not an admin', async () => {
        const res = await request
          .get('/api/v1/parcels')
          .set('authorization', `Bearer ${userToken}`);
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have
          .property('message')
          .eql('only Admins are allowed to view this route');
      });

      it('should get all parcel if the user is an admin', async () => {
        const userDetails = {
          email: 'bola@gmail.com',
          password: 'bola1234',
        };
        const response = await chai
          .request(app)
          .post('/api/v1/auth/login')
          .send(userDetails);
        userToken = response.body.data.token;
        const res = await request
          .get('/api/v1/parcels')
          .set('authorization', `Bearer ${userToken}`);
        res.should.have.status(200);
        res.body.should.be.a('object');
      });
    });

    // get a single route
  });
});
