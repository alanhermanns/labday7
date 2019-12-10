  
require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Attempt = require('../lib/models/Attempt');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an Attempt', () => {
    return request(app)
      .post('/api/v1/attempts')
      .send({
        recipeId: 'Pie4',
        dateOfAttempt: new Date(),
        notes: 'Never ever again',
        rating: 2
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: 'Pie4',
          dateOfAttempt: res.body.dateOfAttempt,
          notes: 'Never ever again',
          rating: 2,
          __v: 0
        });
      });
  });

  it('gets all attempts', async() => {
    const attempts = await Attempt.create([
      { recipeId: 'cookies2', dateOfAttempt: new Date, notes: 'Bad', rating: 2 }
    ]);

    return request(app)
      .get('/api/v1/attempts')
      .then(res => {
        attempts.forEach(attempt => {
          expect(res.body).toContainEqual({
            _id: attempt._id.toString(),
          });
        });
      });
  });

  it('updates an attempt by id', async() => {
    const attempt = await Attempt.create({
      recipeId: 'Pie4',
      dateOfAttempt: String(new Date().toString()),
      notes: 'Never ever again',
      rating: 2
    });

    return request(app)
      .patch(`/api/v1/attempts/${attempt._id}`)
      .send({ notes: 'maybe one more time' })
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: 'Pie4',
          dateOfAttempt: attempt.dateOfAttempt.toISOString(),
          notes: 'maybe one more time',
          rating: 2,
          __v: 0
        });
      });
  });

  it('gets a recipe by id', async() => {
    const attempt = await Attempt.create({
      recipeId: 'Pie4',
      dateOfAttempt: new Date(),
      notes: 'Never ever again',
      rating: 2
    });

    return request(app)
      .get(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: 'Pie4',
          dateOfAttempt: attempt.dateOfAttempt.toISOString(),
          notes: 'Never ever again',
          rating: 2,
          __v: 0
        });
      });
  });
});
