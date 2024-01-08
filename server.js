// Chargement des variables d'environnement 
require('dotenv').config();

// Import des modules nécessaires
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import des routes pour l'authentification

// Import de la configuration de la base de données
const connectDB = require('./config/db.js');
// Initialisation de l'application Express
const app = express();

// Middleware pour traiter les requêtes JSON 
app.use(express.json());

// Middleware pour parser les corps de requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisation des routes pour l'authentification


// Configuration des options cors
const corsOptions = {
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
};

// Middleware pour gérer les cors
app.use(cors(corsOptions));

// Définition du port du démarrage du serveur 
const PORT = process.env.PORT || 5200;

// Fonction pour démarrer le serveur 
const start = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    console.log('Connexion à la base de données réussies');
    // Démarrage du serveur sur le port spécifié
    app.listen(PORT, () => console.log(`Le serveur a démarrer sur le port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
// Appel de la fonction pour démarrer le serveur 
start();
