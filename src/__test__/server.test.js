'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Car from '../model/car';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/car`;

const createMockCar = () => {
  return new Car({
    make: 'Honda',
    model: 'Civic', 
    year: 2012,
    color: 'silver',
  }).save();
};

describe('/api/car', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Car.remove({}));
  const testCar = {
    make: 'Suburu',
    model: 'Forester', 
    year: 2009,
    color: 'orange',
  };

  test('POST - should respond with 200 status and posted information', () => {
    return superagent.post('/api/car')
      .send(testCar)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.make).toEqual(testCar.make);
        expect(response.body.color).toEqual(testCar.color);
        expect(response.body.model).toEqual(testCar.model);
        expect(response.body.year).toEqual(testCar.year);
        expect(response.body._id).toBeTruthy();
      });
  });
});
