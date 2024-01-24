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
describe('Update User API', () => {
	it('Should allow updating user profile for admin', async () => {
		// Id de l'utilisateur admin dans la bdd
		const adminUserId = '65afc465e12bb810a48d23e3';

		// Id de l'utilisateur à rechercher
		const userIdToUpdate = '65af8f6b90320202053c08af';

		// Générer un token d'authentification pour l'admin
		const authToken = generateAuthToken(adminUserId);

		// Faire une demande pour récuperer tous les utilisateurs
		const response = await request(app)
			.put(`/api/update-user/${userIdToUpdate}`)
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				lastname: 'NouveauNom2',
				firstname: 'NouveauPrenom2',
				birthday: '22-04-4000',
				address: 'Adresse rigole',
				zipcode: '33333',
				city: 'Ville',
				phone: '3630303030',
				email: 'wmaillol@gmail.fr',
			});

		// Log de la réponse
		console.log(response.body);

		// S'assurer de la réussite de la demande

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur mis à jour avec succès');
		expect(response.body).toHaveProperty('user');

		// S'assurer que les informations de l' utilisateur ont bien été mis à jour
		const updateUser = await authModel.findById(userIdToUpdate);
		expect(updateUser.lastname).toBe('NouveauNom2');
		expect(updateUser.firstname).toBe('NouveauPrenom2');
		expect(updateUser.birthday).toBe('22-04-4000');
		expect(updateUser.address).toBe('Adresse rigole');
		expect(updateUser.zipcode).toBe('33333');
		expect(updateUser.city).toBe('Ville');
		expect(updateUser.phone).toBe('3630303030');
		expect(updateUser.email).toBe('wmaillol@gmail.fr');
	});
});
