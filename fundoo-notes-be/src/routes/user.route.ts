import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

class UserRoutes {
  private userController = new UserController();
  private router = express.Router();
  private userValidator = new UserValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Registration route
    this.router.post('/register', this.userValidator.registerUser, this.userController.registerUser);

    // Login route
    this.router.post('/login', this.userValidator.loginUser, this.userController.loginUser);
    
    // Forgot password route
    // Add the routes for forgot and reset password
    this.router.post('/forgot-password', this.userController.forgotPassword);
    this.router.post('/reset-password/:token', this.userController.resetPassword);


 
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
