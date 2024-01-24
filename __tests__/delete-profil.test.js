// Import mongoose
const mongoose = require('mongoose');
// Import supertest
const request = require('supertest');
// Import application
const app = require('../server');
// Import JWT
const jwt = require('jsonwebtoken');
// Import model
const authModel = require('../models/auth.model');

// Fonction utilitaire pour générer un token d'authentification
function generateAuthToken(userId) {
	const secretKey = process.env.JWT_SECRET;
	const expiresIn = '1h';

	// Utilisation de la bibliothèque jwt pour générer le token
	return jwt.sign({ user: { id: userId } }, secretKey, { expiresIn });
}

// Connexion à la base de données avant l'exécution des tests
beforeAll(async () => {
	// Utilisation de la méthode connect
	await mongoose.connect(process.env.MONGO_URI);
	// Attente d'une seconde pour assurer la connexion avec la BDD
	await new Promise((resolve) => setTimeout(resolve), 1000);
});

// Fermeture de la connexion après exécution des tests
afterAll(async () => {
	// Utilisation de la méthode close
	await mongoose.connection.close();
});

// Bloc de test pour récuperer tous les utilisateurs
describe('Delete Profile API', () => {
	it('Should allow deleting user profile for admin', async () => {
		// Id du profil utilisateur à supprimé
		const userIdToDelete = '65b0def3dd215cb7a0e3f5ca';

		// Générer un token d'authentification pour l'admin
		const authToken = generateAuthToken(userIdToDelete);

		// Faire une demande pour récuperer tous les utilisateurs
		const response = await request(app)
			.delete(`/api/delete/${userIdToDelete}`)
			.set('Authorization', `Bearer ${authToken}`);

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');

		// S'assurer que le profil  de l' utilisateur ont bien été supprimé
		const deleteUser = await authModel.findById(userIdToDelete);
		expect(deleteUser).toBeNull();
	});
});
