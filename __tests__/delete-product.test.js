// Import mongoose
const mongoose = require('mongoose');
// Import supertest
const request = require('supertest');
// Import application
const app = require('../server');
// Import JWT
const jwt = require('jsonwebtoken');
// Import model
const productModel = require('../models/product.model');

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

// Bloc de test pour supprimer un produit par ID
describe('Delete Product API', () => {
	it('Should allow deleting product for admin', async () => {
		// Id de l'utilisateur admin dans la bdd
		const adminUserId = '65afc465e12bb810a48d23e3';

		// Id du produit à supprimer
		const ProductIdToDelete = '65b1012b6f5cc65d6c87e41c';

		// Générer un token d'authentification pour l'admin
		const authToken = generateAuthToken(adminUserId);

		// Faire une demande pour supprimer un produit par ID
		const response = await request(app)
			.delete(`/api/delete-product/${ProductIdToDelete}`)
			.set('Authorization', `Bearer ${authToken}`);

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Produit supprimé avec succès');

		// S'assurer que les informations du produit ont bien supprimé de la base de données
		const deletedProduct = await productModel.findById(ProductIdToDelete);
		expect(deletedProduct).toBeNull();
	});
});
