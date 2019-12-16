  
require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Attempt = require('../lib/models/Attempt');
let recipe;
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

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [
          {
            amount: 5,
            measurement: 'cups',
            name: 'flour',
          },
          {
            amount: 12,
            measurement: 'sticks',
            name: 'butter',
          }
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              _id: expect.any(String),
              amount: 5,
              measurement: 'cups',
              name: 'flour',
            },
            {
              _id: expect.any(String),
              amount: 12,
              measurement: 'sticks',
              name: 'butter',
            }
          ],
          __v: 0
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => () => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name,
            directions: [],
          });
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: 5,
          measurement: 'cups',
          name: 'flour',
        },
        {
          amount: 12,
          measurement: 'sticks',
          name: 'butter',
        }
      ]
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              _id: expect.any(String),
              amount: 5,
              measurement: 'cups',
              name: 'flour',
            },
            {
              _id: expect.any(String),
              amount: 12,
              measurement: 'sticks',
              name: 'butter',
            }
          ],
          __v: 0
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: 5,
          measurement: 'cups',
          name: 'flour',
        },
        {
          amount: 12,
          measurement: 'sticks',
          name: 'butter',
        }
      ]
    });

    return request(app)
      .get(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          Attempts : [],
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              _id: expect.any(String),
              amount: 5,
              measurement: 'cups',
              name: 'flour',
            },
            {
              _id: expect.any(String),
              amount: 12,
              measurement: 'sticks',
              name: 'butter',
            }
          ],
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          amount: 5,
          measurement: 'cups',
          name: 'flour',
        },
        {
          amount: 12,
          measurement: 'sticks',
          name: 'butter',
        }
      ]
    });
    await Attempt.create({
      recipeId: recipe._id.toString(),
      dateOfAttempt: new Date(),
      notes: 'Never ever again',
      rating: 2
    });
    await Attempt.create({
      recipeId: recipe._id.toString(),
      dateOfAttempt: new Date(),
      notes: 'Oh man',
      rating: 2
    });
    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        console.log(res.body);
        expect(res.body).toEqual({
          _id: recipe._id.toString(),
          'attempts': [
            {
              '__v': 0,
              '_id': expect.any(String),
              'dateOfAttempt': expect.any(String),
              'day': res.body.attempts[0].day,
              'month': res.body.attempts[0].month,
              'year': 2019,
              'notes': 'Never ever again',
              'rating': 2,
              'recipeId': recipe._id.toString(),
            },
            {
              '__v': 0,
              '_id': expect.any(String),
              'dateOfAttempt': expect.any(String),
              'day': res.body.attempts[1].day,
              'month': res.body.attempts[1].month,
              'year': 2019,
              'notes': 'Oh man',
              'rating': 2,
              'recipeId': recipe._id.toString(),
            },
          ],
          deletedAttempts : 2,
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [
            {
              _id: expect.any(String),
              amount: 5,
              measurement: 'cups',
              name: 'flour',
            },
            {
              _id: expect.any(String),
              amount: 12,
              measurement: 'sticks',
              name: 'butter',
            }
          ],
          __v: 0
        });
      });
  });
});
