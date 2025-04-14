const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

beforeAll(async () => {
  // I need to connect to test database
  await mongoose.connect('mongodb://127.0.0.1:27017/TaskManager-test');
});

// after each test -> empty database to make sure every test has the same environment for running
afterEach(async () => {
  await User.deleteMany();
});

// after all tests close connection to database
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /register', () => {
  it('should register a new user and return access token', async () => {
    const res = await request(app).post('/register').send({
      username: 'testuser',
      email: 'test@gmail.com',
      password: 'CorrectPassword2317!'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test@gmail.com');
  });

  it('should not register user with existing email', async () => {
    // first i create and save a user in database
    await User.create({
      username: 'existing',
      email: 'test@example.com',
      password: 'testPasswd!25'
    });

    // then I try to register the same user with post request to /register
    const res = await request(app).post('/register').send({
      username: 'existing',
      email: 'test@example.com',
      password: 'testPasswd!25'
    });

    // I expect 409 Conflicted with message: 'User with this email address already exists.'
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message');
  });
});
