const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authenticate');

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

//Route protegée
router.get('/dashboard', authMiddleware.authenticate, (req, res) => {
	// Vérifier si l'utilisateur est un admin
	if (req.user.role === 'admin') {
		// Définition de req.isAdmin sera egale a true pour les admins
		req.isAdmin = true;
		// Envoyer une réponse de succès
		return res.status(200).json({ message: 'Bienvenue Admin' });
	} else {
		// Envoyer une réponse pour les utilisateurs non admin
		return res
			.status(403)
			.json({
				message: 'Action non autorisée seuls les admins peuvent accéder à cette page',
			});
	}
});

module.exports = router;
