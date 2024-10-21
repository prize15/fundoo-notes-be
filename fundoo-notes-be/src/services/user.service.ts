import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

class UserService {

  // Register a new user
  public registerUser = async (userDetails: IUser): Promise<IUser> => {
    const existingUser = await User.findOne({ email: userDetails.email });
    if (existingUser) {
      throw { code: 400, message: 'User already exists' };
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    userDetails.password = hashedPassword;

    const newUser = await User.create(userDetails);
    return newUser;
  };
}

export default UserService;
