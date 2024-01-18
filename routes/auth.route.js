const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authenticate');
const cloudinaryUpload = require('../middleware/cloudinaryUpload');

// Route pour l'inscription
router.post('/register', cloudinaryUpload, authController.register);

// Route pour vérifier l'email
router.get('/verify-email/:token', authController.verifyEmail);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour la modification du profil
router.put('/update/:id', authMiddleware.verifToken, cloudinaryUpload, authController.update);

// Route pour supprimer notre profil
router.delete('/delete/:id', authMiddleware.verifToken, authController.delete);

// Route pour récupérer tous les utilisateurs (admin)
router.get('/users', authMiddleware.authenticate, authController.getAllUsers);

// Route pour récupérer un utilisateur avec son id
router.get('/user/:id', authMiddleware.authenticate, authController.getUserById);

// Route pour modifier le profil d'un utilisateur (admin)
router.put(
	'/update-user/:id',
	authMiddleware.authenticate,
	cloudinaryUpload,
	authController.updateUser
);

// Route pour supprimer un utilisateur (admin)
router.delete('/delete-user/:id', authMiddleware.authenticate, authController.deleteUser);

// Route pour voir mon profil
router.get('/profil/:id', authMiddleware.verifToken, authController.getProfile);

//Route protegée
router.get('/dashboard', authMiddleware.authenticate, authController.dashboard);

module.exports = router;
