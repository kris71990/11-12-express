'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import carRoutes from '../route/car-routes';

const app = express();
let server = null;

app.use(carRoutes);
app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 error from catch-all route');
  return response.sendStatus(404);
});

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server disconnected');
      });
    });
};

export { startServer, stopServer };
