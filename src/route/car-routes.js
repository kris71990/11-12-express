'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Car from '../model/car';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const carRouter = new Router();

carRouter.post('/api/car', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing request');

  if (!request.body.make || !request.body.model || !request.body.year) {
    logger.log(logger.INFO, 'POST error, nothing to post');
    return response.sendStatus(400);
  }

  return new Car(request.body).save()
    .then((car) => {
      logger.log(logger.INFO, 'POST success, responding with 200');
      return response.json(car);
    })
    .catch((error) => {
      logger.log(logger.ERROR, `POST ERROR 500 - ${error}`);
      return response.sendStatus(500);
    });
});

carRouter.get('/api/car/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing request');

  return Car.findById(request.params.id)
    .then((car) => {
      if (!car) {
        logger.log(logger.INFO, 'GET error, no car found with this id');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET success, responding with 200');
      return response.json(car);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, `GET error - Could not parse id: ${request.params.id}`);
        return response.sendStatus(404);
      }
      
      logger.log(logger.ERROR, 'GET ERROR 500');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

carRouter.delete('/api/car/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing request');

  return Car.findByIdAndRemove(request.params.id)
    .then((car) => {
      if (!car) {
        logger.log(logger.INFO, 'DELETE error - no car found with this id');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE request processed - 200 status');
      return response.sendStatus(200);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, `GET error - Could not parse id: ${request.params.id}`);
        return response.sendStatus(404);
      }

      logger.log(logger.ERROR, 'DELETE ERROR 500');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default carRouter;

