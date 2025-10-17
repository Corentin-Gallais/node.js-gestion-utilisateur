import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserController } from './controllers/UserController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-utilisateurs';

// Middleware
app.use(express.json());

// Controllers et Middleware
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

// Routes publiques
app.post('/auth/register', userController.register);
app.post('/auth/login', userController.login);

// Routes protégées
app.get('/users', authMiddleware.authenticate, userController.getUsers);
app.get('/users/:id', authMiddleware.authenticate, userController.getUserById);
app.put('/users/:id', authMiddleware.authenticate, userController.updateUser);
app.delete('/users/:id', authMiddleware.authenticate, userController.deleteUser);

// Gestion des événements MongoDB
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose déconnecté de MongoDB');
});

// Connexion à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    console.log('📊 Base de données:', MONGODB_URI.split('/')[3]?.split('?')[0] || 'gestion-utilisateurs');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`🌐 API disponible sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });
