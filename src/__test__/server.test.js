'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Car from '../model/car';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/car`;

const fakerMocks = () => {
  return new Car({
    make: faker.lorem.words(2),
    model: faker.lorem.words(3),
  }).save();
};

const createMockCar = () => {
  return new Car({
    make: 'Honda',
    model: 'Civic', 
    year: 2012,
    color: 'silver',
  }).save();
};

const createManyMocks = (howMany) => {
  return Promise.all(new Array(howMany)
    .fill(0)
    .map(() => fakerMocks()));
};

describe('/api/car', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Car.remove({}));
  
  test('POST - should respond with 200 status and posted information', () => {
    const testCar = {
      make: 'Suburu',
      model: 'Forester', 
      year: 2009,
      color: 'orange',
    };
    return superagent.post(apiURL)
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

  test('POST - should respond with 400 status for error', () => {
    const testCar = {
      make: faker.lorem.words(5),
    };
    return superagent.post(apiURL)
      .send(testCar)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  describe('GET api/car/:id', () => {
    test('GET - should respond with 200 status and information', () => {
      let testCar = null;
      return createMockCar()
        .then((car) => {
          testCar = car;
          return superagent.get(`${apiURL}/${car._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.make).toEqual(testCar.make);
          expect(response.body.year).toEqual(testCar.year);
          expect(response.body._id).toBeTruthy();
        });
    });
    test('GET - should respond with 404 error if car doesn\'t exist', () => {
      return superagent.get(`${apiURL}/blahblahblah`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  
  describe('DELETE api/car/:id', () => {
    test('DELETE - should respond with 200 status', () => {
      return createMockCar()
        .then((car) => {
          return superagent.delete(`${apiURL}/${car._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeFalsy();
        });
    });

    test('DELETE - should respond with 404 for id not found', () => {
      return createMockCar()
        .then(() => {
          return superagent.delete(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('UPDATE api/car/:id', () => {
    test('PUT - should respond with 200 status and updated information', () => {
      let testCar = null;
      return createMockCar()
        .then((car) => {
          testCar = car;
          return superagent.put(`${apiURL}/${car._id}`)
            .send({ 
              make: 'Ford', 
              model: 'Focus', 
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.make).toEqual('Ford');
          expect(response.body.model).toEqual('Focus');
          expect(response.body.year).toEqual(testCar.year);
          expect(response.body._id).toEqual(testCar._id.toString());
        });
    });

    test('UPDATE - should respond with 404 for id not found', () => {
      return createMockCar()
        .then(() => {
          return superagent.put(`${apiURL}/1234`);
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

