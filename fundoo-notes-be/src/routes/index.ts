import express, { IRouter } from 'express';
import userRoute from './user.route';
import noteRoute from './note.route'; // Import note routes

const router = express.Router();

const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', new userRoute().getRoutes());
  router.use('/notes', new noteRoute().getRoutes()); // Add note routes here

  return router;
};

export default routes;
