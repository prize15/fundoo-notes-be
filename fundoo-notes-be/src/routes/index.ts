import express, { IRouter } from 'express';
import userRoute from './user.route';
import noteRoute from './note.route'; // Import note routes
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

const router = express.Router();

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());
  router.use('/notes', new noteRoute().getRoutes()); // Add note routes here
  router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


  return router;
};

export default routes;
