// Importation du module mongoose
const mongoose = require('mongoose');
// Chargements des variables d'environnement
require('dotenv').config();

// Connexion à la base de données avant l'exécution de tous les tests
beforeAll(async () => {
	// Utilisation de la méthode connect de mongoose pour établir la connexion à la base de données
	await mongoose.connect(process.env.MONGO_URI);
});

// Fermeture de la connexion  à la base de données après exécution de tous les tests
afterAll(async () => {
	// Utilisation de la méthode close de mongoose pour fermer la connexion à la base de données
	await mongoose.connection.close();
});

// Test vérifiant que la connexion à la base de données est bien établie
// La propriété readyState de l'objet mongoose.connection est évalué à 1 lorsque la connexion sera établie
test('should connect to the database', async () => {
	const isConnected = mongoose.connection.readyState === 1;
	// Assertion vérifiant que la connexion à la base de données est bien établie
	expect(isConnected).toBeTruthy();
});
