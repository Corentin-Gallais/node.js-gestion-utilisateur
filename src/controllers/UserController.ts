import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middlewares/AuthMiddleware';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'DONNEES_INVALIDES',
          message: 'Email et mot de passe requis'
        });
        return;
      }

      const result = await this.userService.register(email, password);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'EMAIL_DEJA_UTILISE') {
        res.status(409).json({
          error: 'EMAIL_DEJA_UTILISE',
          message: 'Cet email est déjà utilisé'
        });
      } else {
        res.status(500).json({
          error: 'ERREUR_SERVEUR',
          message: 'Erreur interne du serveur'
        });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'DONNEES_INVALIDES',
          message: 'Email et mot de passe requis'
        });
        return;
      }

      const result = await this.userService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'UTILISATEUR_NON_TROUVE' || error.message === 'MAUVAIS_IDENTIFIANTS') {
        res.status(401).json({
          error: 'MAUVAIS_IDENTIFIANTS',
          message: 'Email ou mot de passe incorrect'
        });
      } else {
        res.status(500).json({
          error: 'ERREUR_SERVEUR',
          message: 'Erreur interne du serveur'
        });
      }
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({
        error: 'ERREUR_SERVEUR',
        message: 'Erreur interne du serveur'
      });
    }
  };

  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'UTILISATEUR_NON_TROUVE') {
        res.status(404).json({
          error: 'UTILISATEUR_NON_TROUVE',
          message: 'Utilisateur non trouvé'
        });
      } else {
        res.status(500).json({
          error: 'ERREUR_SERVEUR',
          message: 'Erreur interne du serveur'
        });
      }
    }
  };

  updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { email, password } = req.body;

      const user = await this.userService.updateUser(id, { email, password });
      res.status(200).json(user);
    } catch (error: any) {
      if (error.message === 'UTILISATEUR_NON_TROUVE') {
        res.status(404).json({
          error: 'UTILISATEUR_NON_TROUVE',
          message: 'Utilisateur non trouvé'
        });
      } else if (error.message === 'EMAIL_DEJA_UTILISE') {
        res.status(409).json({
          error: 'EMAIL_DEJA_UTILISE',
          message: 'Cet email est déjà utilisé'
        });
      } else {
        res.status(500).json({
          error: 'ERREUR_SERVEUR',
          message: 'Erreur interne du serveur'
        });
      }
    }
  };

  deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.status(200).json({ message: 'Utilisateur supprimé' });
    } catch (error: any) {
      if (error.message === 'UTILISATEUR_NON_TROUVE') {
        res.status(404).json({
          error: 'UTILISATEUR_NON_TROUVE',
          message: 'Utilisateur non trouvé'
        });
      } else {
        res.status(500).json({
          error: 'ERREUR_SERVEUR',
          message: 'Erreur interne du serveur'
        });
      }
    }
  };
}