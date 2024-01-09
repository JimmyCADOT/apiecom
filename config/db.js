// On importe mongoose
const mongoose = require('mongoose');

// Définition de l'url de connexsion à  la base de données
const url = process.env.MONGO_URI;

const connectDB = () => {
    mongoose 
       .connect(url) 
       // le .then() est une promesse qui permet de gérer la connexion à la base de données et le . catch permet de gérer et capturer les erreurs
       .then(() => {
          console.log('Connexion à la base de données');
       }) 
       .catch ((err) => {
        console.error('Erreur de connexion avec la base de données', err.message);
       });

       
};

// Export de la fonction connectDB
module.exports = connectDB;