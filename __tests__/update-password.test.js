// Import de mongoose
const mongoose = require('mongoose');
// Import supertest
const request = require('supertest');
// Import app
const app = require('../server');
// Import model
const authModel = require('../models/auth.model');

// Connexion à la base de données avant l'exécution des tests
beforeAll(async () => {
	// Utilisation de la méthode connect
	await mongoose.connect(process.env.MONGO_URI);
	// Attente d'une seconde pour la connexion à la bdd
	await new Promise((resolve) => setTimeout(resolve, 1000));
});

// Fermeture de la connexion après l'exécution des tests
afterAll(async () => {
	// Utilisation de la méthode close
	await mongoose.connection.close();
});

// Bloc de tests pour la route update password
describe('Testing route /api/update-password/:token', () => {
	//Variable pour stocker le token
	let resetPasswordToken;

	// Avant tous les test récupérer un utilisateur avec un token valide dans la bdd
	beforeAll(async () => {
		const user = await authModel.findOne({
			email: 'exemple@gmail.com',
		});
		// Vérification de l'utilisateur
		if (user) {
			resetPasswordToken = user.resetPasswordToken;
		}
	});
	// Tests vérifiant que la route renvoie un code 400 si les mots de passes ne correspondent pas
	it('Should return status code 400 if passwords do not match', async () => {
		const response = await request(app).put(`/api/update-password/${resetPasswordToken}`).send({
			newPassword: 'NewPassword',
			confirmNewPassword: 'DifferentPassword',
		});
		// Vérifie que la réponse attendu est 400
		expect(response.status).toBe(400);
	});
	// Test vérifiant que la route renvoie un code 400 si le token est invalide
	it('Should return status code 400 if reset password token is invalid', async () => {
		const response = await request(app).put('/api/update-password/invalid-token').send({
			newPassword: 'newPassword',
			confirmNewPassword: 'newPassword',
		});
		// Vérifie que la réponse attendu est 400
		expect(response.status).toBe(400);
	});
	// Vérifier que la réponse attendu est 200
	it('Should return status 200 if password is successfully result', async () => {
		// S'assurer que le resetPasswordToken est  défini avant le test
		console.log('Reset password token:', resetPasswordToken);
		if (resetPasswordToken) {
			const response = await request(app)
				.put(`/api/update-password/${resetPasswordToken}`)
				.send({
					newPassword: '123456789',
					confirmNewPassword: '123456789',
				});
			// Vérifier que la réponse attendu est 200
			console.log('Response', response.body);
			expect(response.status).toBe(200);
		}
	});
});
