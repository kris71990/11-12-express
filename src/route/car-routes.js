'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Car from '../lib/logger';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const carRouter = new Router();

carRouter.post('/api/car', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing request');
});
