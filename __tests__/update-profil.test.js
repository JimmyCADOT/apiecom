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

// Mock de la méthode destroy de cloudinary pour éviter de supprimer réellement les fichiers lors des tests
jest.mock('cloudinary');

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

// Fonction utilitaire pour générer un token d'authentification
function generateAuthToken(user) {
	const secretKey = process.env.JWT_SECRET;
	const expiresIn = '1h';

	// Utilisation du jwt pour générer le token
	return jwt.sign({ userId: user._id }, secretKey, { expiresIn });
}

// Bloc de test pour la route de mis à jour du profil
describe('Update Profile API', () => {
	it('Should update the user profile', async () => {
		// Entrer l'utilisateur existant en base de données (id)
		const existingUserId = '65af8f6b90320202053c08af';
		const existingUser = await authModel.findById(existingUserId);

		expect(existingUser).toBeDefined();

		// Générer un token
		const authToken = generateAuthToken(existingUser);

		// Utiliser supertest pour envoyer une requête PUT
		const response = await request(app)
			.put(`/api/update/${existingUserId}`)
			.set('Authorization', `Bearer ${authToken}`)
			.send({
				lastname: 'NouveauNom',
				firstname: 'NouveauPrénom',
				birthday: '28-03-1994',
				address: 'Nouvelle adresse',
				zipcode: '22000',
				city: 'Ville',
				phone: '0910111213',
				email: 'cadot@gmail.com',
			});
		// Afficher le corps de la réponse en cas d'échec
		if (response.status !== 200) {
			console.log(response.body);
		}
		// S'assurer que la réponse est 200
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('message', 'Utilisateur mis à jour avec succès');
		expect(response.body).toHaveProperty('user');
	});
});
