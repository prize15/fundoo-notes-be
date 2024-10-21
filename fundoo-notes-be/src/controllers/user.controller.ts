import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService = new UserService();

  // Register a new user
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error);  // Error handling middleware will take care of the response
    }
  };
}

export default UserController;
