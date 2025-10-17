import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';

export class UserService {
  private userRepository: UserRepository;
  private jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key';

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(email: string, password: string): Promise<{ user: any; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('EMAIL_DEJA_UTILISE');
    }

    const user = await this.userRepository.create({ email, password });
    const token = this.generateToken((user as any)._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email
      },
      token
    };
  }

  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('UTILISATEUR_NON_TROUVE');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('MAUVAIS_IDENTIFIANTS');
    }

    const token = this.generateToken((user as any)._id.toString());

    return {
      user: {
        id: user._id,
        email: user.email
      },
      token
    };
  }

  async getUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('UTILISATEUR_NON_TROUVE');
    }
    return user;
  }

  async updateUser(id: string, userData: { email?: string; password?: string }): Promise<IUser | null> {
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser && (existingUser as any)._id.toString() !== id) {
        throw new Error('EMAIL_DEJA_UTILISE');
      }
    }

    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new Error('UTILISATEUR_NON_TROUVE');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.delete(id);
    if (!user) {
      throw new Error('UTILISATEUR_NON_TROUVE');
    }
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('JWT_MANQUANT_OU_INVALIDE');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '24h' });
  }
}