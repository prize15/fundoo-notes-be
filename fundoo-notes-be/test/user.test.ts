import request from 'supertest';
import app from '../src/index'; // Import your express app
import chai from 'chai';
const { expect } = chai;

let token: string; // Variable to store the auth token for testing

describe('User API', () => {
  // Test Registration
  it('should register a new user', (done) => {
    const userData = {
      firstame: 'John',
      lastname:'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    request(app)
      .post('/api/v1/users/register') // Make sure your route is correct
      .send(userData)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('User registered successfully');
        done();
      });
  });

  // Test Login
  it('should login a user and return a token', (done) => {
    const userLogin = {
      email: 'john@example.com',
      password: 'password123',
    };

    request(app)
      .post('/api/v1/users/login')
      .send(userLogin)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('token');
        token = res.body.token; // Store the token to use in other tests
        done();
      });
  });

  // Test Protected Route (Get all users with valid token)
  it('should get all users (authenticated)', (done) => {
    request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`) // Send the token in the header
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
