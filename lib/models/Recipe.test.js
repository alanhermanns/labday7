const mongoose = require('mongoose');
const Recipe = require('./Recipe');

describe('Recipe model', () => {
  it('has a required name', () => {
    const recipe = new Recipe();
    const { errors } = recipe.validateSync();

    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('has a name and directions and ingredients field', () => {
    const recipe = new Recipe({
      name: 'Cookies',
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

    expect(recipe.toJSON()).toEqual({
      _id: expect.any(Object),
      name: 'Cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [
        {
          _id: expect.any(Object),
          amount: 5,
          measurement: 'cups',
          name: 'flour',
        },
        {
          _id: expect.any(Object),
          amount: 12,
          measurement: 'sticks',
          name: 'butter',
        }
      ]
    });
  });
});
