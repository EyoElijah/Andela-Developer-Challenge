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

describe('Auth Route', () => {
  //POST Signup Route
  describe('POST /api/v1/auth/signup', () => {
    it('SHOULD NOT register the user if firstname is omitted', async () => {
      const newUser = {
        lastname: 'wagner',
        email: 'MikeDane@andela.com',
        username: 'mikeDane',
        isAdmin: true,
        password: 'Ilove0bats#',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it('SHOULD NOT register the user if lastname is omitted', async () => {
      const newUser = {
        firstname: 'swager',
        email: 'MikeDane@andela.com',
        username: 'mikeDane',
        isAdmin: true,
        password: 'Ilove0bats#',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it('SHOULD NOT register the user if email is omitted', async () => {
      const newUser = {
        firstname: 'swager',
        lastname: 'james',
        username: 'mikeDane',
        isAdmin: true,
        password: 'Ilove0bats#',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it('SHOULD NOT register the user if username is omitted', async () => {
      const newUser = {
        firstname: 'swager',
        lastname: 'james',
        email: 'MikeDane@andela.com',
        isAdmin: true,
        password: 'Ilove0bats#',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it('SHOULD NOT register the user if password is omitted', async () => {
      const newUser = {
        firstname: 'swager',
        lastname: 'james',
        username: 'mikeDane',
        email: 'MikeDane@andela.com',
        isAdmin: true,
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it('SHOULD NOT register the user if password is less than 5 characters', async () => {
      const newUser = {
        firstname: 'swager',
        lastname: 'james',
        email: 'MikeDane@andela.com',
        username: 'mikeDane',
        isAdmin: true,
        password: '1234',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });

    it("SHOULD register the user if user doesn't exist", async () => {
      const newUser = {
        firstname: 'testCase',
        lastname: 'CaseTest',
        email: 'testCase5@gmail.com',
        username: 'test123',
        isAdmin: true,
        password: 'password',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(201);
      res.body.should.have.property('status').eql(201);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('user');
    });

    it('SHOULD NOT register the user if user already exists', async () => {
      const newUser = {
        firstname: 'testCase',
        lastname: 'CaseTest',
        email: 'testCase1@gmail.com',
        username: 'test123',
        isAdmin: true,
        password: 'password',
      };
      const res = await request.post('/api/v1/auth/signup').send(newUser);
      res.should.have.status(400);
      res.body.should.have.property('error');
      res.body.should.have.property('status').eql(400);
    });
  });

  //POST Login Route
  describe('POST /api/v1/auth/login', () => {
    it('SHOULD NOT login the user if email is omitted', async () => {
      const loginDetails = {
        password: 'Ilove0dogs#',
      };
      const res = await request.post('/api/v1/auth/login').send(loginDetails);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
    });

    it('SHOULD NOT login the user if password field is omitted', async () => {
      const loginDetails = {
        email: 'tomblack@mandela.com',
      };
      const res = await request.post('/api/v1/auth/login').send(loginDetails);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
    });

    it('Should not log in the user if the email is incorrect', async () => {
      const userDetails = {
        email: 'testcasd@gmail.com',
        password: 'password',
      };
      const res = await request.post('/api/v1/auth/login').send(userDetails);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql(401);
    });

    it('Should not log in the user if the password is incorrect', async () => {
      const userDetails = {
        email: 'testcase@gmail.com',
        password: 'password12',
      };
      const res = await request.post('/api/v1/auth/login').send(userDetails);
      res.should.have.status(401);
      res.body.should.have.property('error');
      res.body.should.be.a('object');
      res.body.should.have.property('status').eql(401);
    });

    it('SHOULD login the user if user is found', async () => {
      const loginDetails = {
        email: 'testcase@gmail.com',
        password: 'password',
      };
      const res = await request.post('/api/v1/auth/login').send(loginDetails);
      res.should.have.status(200);
      res.body.should.have.property('status').eql(200);
      res.body.should.be.a('object');
      res.body.data.should.be.a('object');
      res.body.data.should.have.property('token');
    });
  });
});
