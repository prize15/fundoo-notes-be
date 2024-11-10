import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
  // Get all users
  public getAllUsers = async (): Promise<IUser[]> => {
    const data = await User.find();
    return data;
  };

  // Create a new user
  public newUser = async (body: IUser): Promise<IUser> => {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw { code: 400, message: 'User already exists' };
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    const data = await User.create(body);
    return data;
  };

  // Login user
  public loginUser = async (email: string, password: string): Promise<string> => {
    const user = await User.findOne({ email });
    if (!user) {
      throw { code: 401, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { code: 401, message: 'Invalid email or password' };
    }

    // Generate a JWT token
    const token = jwt.sign({ user: { id: user._id } }, 'your-secret-key', {
      expiresIn: '1h' // Token expiration time
    });
    
    return token;
  };

  // Get a single user
  public getUser = async (_id: string): Promise<IUser> => {
    const data = await User.findById(_id);
    if (!data) {
      throw { code: 404, message: 'User not found' };
    }
    return data;
  };

  // Update a user
  public updateUser = async (_id: string, body: IUser): Promise<IUser> => {
    const data = await User.findByIdAndUpdate(
      { _id },
      body,
      { new: true }
    );
    if (!data) {
      throw { code: 404, message: 'User not found' };
    }
    return data;
  };

  // Delete a user
  public deleteUser = async (_id: string): Promise<string> => {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      throw { code: 404, message: 'User not found' };
    }
    return 'User deleted successfully';
  };
   // Get user by email
   public getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email });
  };

  // Get user by ID
  public getUserById = async (_id: string): Promise<IUser | null> => {
    return await User.findById(_id);
  };

  // Update user password
  public updateUserPassword = async (_id: string, newPassword: string): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(_id, { password: newPassword }, { new: true });
  };



}

export default UserService;
