import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService = new UserService();

  // Registration method
  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.newUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error);  // Error handling middleware will take care of the response
    }
  };

  // Login method
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.loginUser(email, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      next(error);  // Error handling middleware will take care of the response
    }
  };

  // Get all users
  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  // Get a single user
  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUser(req.params._id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  // Update a user
  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await this.userService.updateUser(req.params._id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  // Delete a user
  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params._id);
      res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
