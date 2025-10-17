import User, { IUser } from '../models/User';

export class UserRepository {
  async create(userData: { email: string; password: string }): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  async update(id: string, userData: Partial<{ email: string; password: string }>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}