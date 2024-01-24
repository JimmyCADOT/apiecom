// Import mongoose
const mongoose = require('mongoose');
// Import supertest
const request = require('supertest');
// Import application
const app = require('../server');
// Import JWT
const jwt = require('jsonwebtoken');

// Fonction utilitaire pour générer un token d'authentification
function generateAuthToken(userId, role) {
	const secretKey = process.env.JWT_SECRET;
	const expiresIn = '1h';

	// Utilisation de la bibliothèque jwt pour générer le token
	return jwt.sign({ user: { id: userId }, role }, secretKey, { expiresIn });
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

// Bloc de test pour vérifier si je peux accéder au dashboard en tant qu'admin
describe('Dashboard API', () => {
	it('Should allow access to the dashboard for admin', async () => {
		// Id de l'utilisateur admin dans la bdd
		const adminUserId = '65afc465e12bb810a48d23e3';

		// Générer un token pour l'admin
		const authToken = generateAuthToken(adminUserId, 'admin');

		// Faire la demande pour accéder au dashboard
		const response = await request(app)
			.get('/api/dashboard')
			.set('Authorization', `Bearer ${authToken}`);

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Bienvenue Admin');
	});
	// Test si l'utilisateur n'a pas le rôle admin
	it('Should return an error for non-admin users trying to access the dashboard', async () => {
		// Id d'un utilisateur non admin dans la base de données
		const nonAdminUserId = '65af8f6b90320202053c08af';

		// Génération d'un token
		const authToken = generateAuthToken(nonAdminUserId, 'user');

		// Faire la demande pour accéder au dashboard
		const response = await request(app)
			.get('/api/dashboard')
			.set('Authorization', `Bearer ${authToken}`);

		// Log de la réponse
		console.log(response.body);

		// S'assurer que la réponse est un 403
		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'Action non autorisée, seuls les admin peuvent acceder à cette page'
		);
	});
});
