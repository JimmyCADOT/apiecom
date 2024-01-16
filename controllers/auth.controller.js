// Import du model utilisateur
const authModel = require('../models/auth.model');
// Import de la validation des données
const { validationResult } = require('express-validator');
// Import du modèle de hachage bcrypt
const bcrypt = require('bcryptjs');
// Import du module jwt pour les tokens
const jwt = require('jsonwebtoken');
// Import du module validator pour la validation des emails
const validator = require('validator');
// Import du module cloudinary
const cloudinary = require('cloudinary').v2;

// Fonction pour l'inscription
module.exports.register = async (req, res) => {
	// Validation des données d'entrée
	try {
		// Récupération des erreurs de validations
		const errors = validationResult(req);
		// Vérification si il y a pas des erreurs de validation
		if (!errors.isEmpty()) {
			// Renvoi des erreurs de validation
			return res.status(400).json({ errors: errors.array() });
		}
		// Récupération des données du formulaire
		const { lastname, firstname, birthday, address, zipcode, city, phone, email, password } =
			req.body;

		// Vérifier si une image est téléchargée
		if (!req.cloudinaryUrl || !req.file) {
			return res.status(400).json({ message: 'Veuillez télécharger une image' });
		}

		// Vérifier si l'email existe déjà dans la table auth
		const existingAuth = await authModel.findOne({ email });
		// Renvoie une erreur si l'email existe déjà
		if (existingAuth) {
			return res.status(400).json({
				message: 'Votre email existe deja en base de données. Veuillez en choisir un autre',
			});
		}

		// Utilisation  de l'url de cloudinary et du public_id  du middleware
		const avatarUrl = req.cloudinaryUrl;
		const avatarPublicId = req.file.public_id;

		// Création d'un nouvel utilisateur
		const auth = authModel.create({
			lastname,
			firstname,
			birthday,
			address,
			zipcode,
			city,
			phone,
			email,
			password,
			avatarUrl,
			avatarPublicId,
		});

		// Renvoie une réponse positive si l'utilisateur est bien enregistré
		res.status(200).json({ message: 'Utilisateur créé avec succès', auth });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erreur lors de l'enregistrement de l'utilisateur" });
	}
};

// Fonction pour la connexion
module.exports.login = async (req, res) => {
	try {
		// Récupération des erreurs de validation
		const errors = validationResult(req);
		// Vérification si il y a des erreurs de validation
		if (!errors.isEmpty()) {
			// Renvoie des erreurs de validation
			return res.status(400).json({ errors: errors.array() });
		}
		// Récupération des données du formulaire
		const { email, password } = req.body;

		// Vérification si l'utilisateur existe déjà dans la base de données
		const Auth = await authModel.findOne({ email });

		// Si l'utilisateur n'existe pas,  renvoie une erreur
		if (!Auth) {
			console.log('Utilisateur non trouvé');
			return res.status(400).json({ message: 'Email invalide' });
		}
		// Vérification du mot de passe
		const isPasswordValid = await bcrypt.compare(
			// user.password = le mot de passe haché en base de données
			// password = mot de passe entré par l'utilisateur
			password,
			Auth.password
		);
		// Si le mot de passe est incorrect,  renvoie une erreur
		if (!isPasswordValid) {
			console.log('Mot de passe incorrect');
			return res.status(400).json({ message: 'Mot de passe incorrect' });
		}
		// Renvoie d'un message de succès
		console.log('connexion réussie !');

		// Création du token jwt
		const payload = {
			Auth: {
				id: Auth._id,
				email: Auth.email,
			},
		};
		// Définition de la variable pour le token
		const secretKey = process.env.JWT_SECRET;
		// Définition de la date d'expiration du token
		const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
		// Renvoie un message de réussite et le token
		res.status(200).json({ message: 'Connexion réussie', token });
	} catch (error) {
		console.error('Erreur lors de la connexion : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la connexion' });
	}
};
// Fonction pour la modification du profil
module.exports.update = async (req, res) => {
	try {
		// Déclaration de variable pour la gestion des erreurs de validations
		const errors = validationResult(req);

		// Vérification si il a des erreurs
		if (!errors.isEmpty) {
			return res.status(400).json({ errors: array() });
		}

		// Récupération de l'id de l'utilisateur pour le mettre en param de requête
		const userId = req.params.id;

		// Récupération des données du formulaire
		const { lastname, firstname, birthday, address, zipcode, city, phone, email } = req.body;

		// Vérifier si l'utilisateur existe avant la mise à jour
		const existingUser = await authModel.findById(userId);

		// Condition si l'utilisateur n'existe pas en base de données
		if (!existingUser) {
			return res.status(404).json({ message: 'Utilisateur non trouvé' });
		}
		// Mettre à jour le chemin de l'image
		if (req.file) {
			// Supprimer l'ancienne image sur cloudinary si elle existe
			if (existingUser.avatarPublicId) {
				await cloudinary.uploader.destroy(existingUser.avatarPublicId);
			}

			// Redonne une nouvelle url et un nouvel a l'image
			existingUser.avatarUrl = req.cloudinaryUrl;
			existingUser.avatarPublicId = req.file.public_id;
		}
		// Mettre à jour les informations de l'utilisateur
		existingUser.lastname = lastname;
		existingUser.firstname = firstname;
		existingUser.birthday = birthday;
		existingUser.address = address;
		existingUser.zipcode = zipcode;
		existingUser.city = city;
		existingUser.phone = phone;

		// Mettre à jour l'email uniquement si fourni dans la requête
		if (email) {
			existingUser.email = email;
		}

		// Sauvegarder les modifications
		await existingUser.save();

		// Code de réussite avec log
		res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: existingUser });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
	}
};
module.exports.delete = async (req, res) => {
	try {
		// Déclaration de la variable qui va rechercher l'id utilisateur pour le mettre en params url
		const userId = req.params.id;

		// Déclaration de variable qui va vérifier si l'utilisateur existe
		const existingUser = await authModel.findById(userId);

		// Suppression de l'avatar de cloudinary si celui ci existe
		if (existingUser.avatarPublicId) {
			await cloudinary.uploader.destroy(existingUser.avatarPublicId);
		}

		//  Supprimer l'utilisateur de la base de données
		await authModel.findByIdAndDelete(userId);

		// Message de réussite
		res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
	}
};
module.exports.getAllUsers = async (req, res) => {
	try {
		// Verifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// Retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut créer un produit' });
		}
		const users = await authModel.find();

		res.status(200).json({ message: 'Liste des utilisateurs', users });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erreur lors de la recupération des utilisateurs' });
	}
};

module.exports.getUserById = async (req, res) => {
	try {
		// Verifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// Retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut créer un produit' });
		}

		// Récuperer l'id de l'utilisateur
		const userId = req.params.id;

		// Vérifier si l'utilisateur existe en base de données
		const user = await authModel.findById(userId);

		// Condition si l'utilisateur n'est pas en bdd
		if (!user) {
			return res.status(404).json({ message: 'Utilisateur non trouvé' });
		}
		// Message de réussite
		res.status(200).json({ user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erreur lors de la recupération de l'utilisateur" });
	}
};
module.exports.dashboard = async (req, res) => {
	try {
		// Verifier si l'utilisateur est un admin
		if (req.user.role === 'admin') {
			// Definition de req.isAdmin sera egal a true pour les admins
			req.isAdmin = true;
			// Envoyer une réponse de succès
			return res.status(200).json({ message: 'Bienvenue Admin' });
		} else {
			// Envoyer une réponse pour les utilisateurs non admin
			return res.status(403).json({
				message: 'Action non autorisée, seuls les admin peuvent acceder à cette page',
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Erreur lors de la connexion' });
	}
};
