// Import mongoose
const mongoose = require('mongoose');
// Import supertest
const request = require('supertest');
// Import application
const app = require('../server');

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

// Bloc de test pour récuperer tous les produits
describe('Get All Products API', () => {
	it('Should get all products', async () => {
		// Faire une demande pour récuperer tous les produits
		const response = await request(app).get('/api/all-products');

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Liste des produits');
		expect(response.body).toHaveProperty('products');
	});
});
