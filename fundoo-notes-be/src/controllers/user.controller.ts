import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';
import MailerService from '../services/mailer.service';

class UserController {
  private userService = new UserService();

  // Registration method
  public registerUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const user = await this.userService.newUser(req.body);
      return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error);  // Error handling middleware will take care of the response
    }
  };

  // Login method
  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.userService.loginUser(email, password);
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      next(error);  // Error handling middleware will take care of the response
    }
  };

  // Get all users
  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  // Get a single user
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const user = await this.userService.getUser(req.params._id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  // Update a user
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const updatedUser = await this.userService.updateUser(req.params._id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  // Delete a user
  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      await this.userService.deleteUser(req.params._id);
      return res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  // Forgot password - Send reset link
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { email } = req.body;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ code: 404, message: 'User not found' });
      }

      // Create a reset token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1h' });

      // Send reset token to user email
      const resetLink = `${process.env.APP_HOST}/reset-password/${token}`;
      await MailerService.sendMail(user.email, 'Password Reset Request', `Click on this link to reset your password: ${resetLink}`);

      return res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
      next(error);
    }
  };

  // Reset password - Update user password
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { token, newPassword } = req.body;

    try {
      // Verify reset token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded: any = jwt.verify(token, jwtSecret);
      const user = await this.userService.getUserById(decoded._id);
      if (!user) {
        return res.status(404).json({ code: 404, message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await this.userService.updateUserPassword(decoded._id, hashedPassword);

      return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
