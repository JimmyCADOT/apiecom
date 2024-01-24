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

// Bloc de test pour récuperer un produit par ID
describe('Get product by ID API', () => {
	it('Should get a specific product by id ID', async () => {
		// Id du produit à récupérer
		const productIdToGet = '65b10443f38ba8e46a179205';

		// Faire la demande pour récuperer un produit par ID
		const response = await request(app).get(`/api/product/${productIdToGet}`);

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('product');
	});
});
