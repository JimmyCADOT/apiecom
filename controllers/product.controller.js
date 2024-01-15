const productModel = require('../models/product.model');

// Fonction pour créer un produit (accessible seulement par l'administrateur)
module.exports.createProduct = async (req, res) => {
	try {
		// Récupération des données du formulaire
		const { title, description, price } = req.body;

		// Vérification si une image est téléchargée
		if (!req.file) {
			return res.status(400).json({ message: 'Veuillez télécharger une image' });
		}
		// Déclaration de variable pour recuperer le chemin de l'image après le téléchargement
		const imageUrl = req.file.path;

		// Déclaration de variable pour recuperer l'id de l'utilisateur qui va poster un produit
		const userId = req.user._id;

		// Création d'un produit
		const newProduct = await productModel.create({
			title,
			description,
			price,
			imageUrl,
			createdBy: userId,
		});

		res.status(200).json({ message: 'Produit ajouté avec succès', product: newProduct });
	} catch (error) {
		console.error('Erreur lors de la création du produit:', error.message);
		res.status(500).json({ message: 'Erreur lors de la création du produit' });
	}
};

// Fonction pour récupérer tous les produits
module.exports.getAllProducts = async (req, res) => {
	try {
		// Récupération de tous les produits
		const products = await productModel.find();
		// Réponse de succès
		res.status(200).json({ message: 'Liste des produits', products });
	} catch (error) {
		console.error('Erreur lors de la récupération des produits : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la récupération  des produits' });
	}
};

// Fonction qui va permettre de récupérer un seul produit avec son id
module.exports.getProductById = async (req, res) => {
	try {
		// Déclaration de la variable qui va rechercher l'id du produit
		const productId = req.params.id;

		// Récupération du produit par son id
		const product = await productModel.findById(productId);

		// Condition si le produit est introuvable
		if (!product) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}
		res.status(200).json({ message: 'Produit récupéré avec succès', product });
	} catch (error) {
		console.error('Erreur lors de la récupération du produit : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la récupération  du produit' });
	}
};

// Fonction pour supprimer un produit avec son id (accessible seulement par l'admin)
module.exports.deleteProduct = async (req, res) => {
	try {
		// Vérifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// Retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorisée. Seul un admin peut supprimer un produit' });
		}
		// Déclaration de la variable qui va rechercher l'id du produit
		const productId = req.params.id;

		// Récupération du produit par son id
		const deletedProduct = await productModel.findByIdAndDelete(productId);

		// Condition si le produit est introuvable
		if (!deletedProduct) {
			return res.status(404).json({ message: 'Produit non trouvé' });
		}
		res.status(200).json({ message: 'Produit supprimé avec succès' });
	} catch (error) {
		console.error('Erreur lors de la suppression du produit : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la suppression  du produit' });
	}
};
module.exports.updateProduct = async (req, res) => {
	try {
		//verifier si l'utilisateur est admin
		if (req.user.role !== 'admin') {
			// retour d'un message d'erreur
			return res
				.status(403)
				.json({ message: 'Action non autorise seul un admin peut supprimé un produit' });
		}
		// Déclaration de la variables qui vas rechercher l'id du produit
		const productId = req.params.id;
		// modiffication du produit par son id
		const existingProduct = await ProductModel.findById(productId);
		// Condition si le produit est introuvables
		if (!existingProduct) {
			return res.status(404).json({ message: 'produit non trouvé' });
		}
		// Mettre a jour les propriété du produits avec les données du corps de la requete
		existingProduct.title = req.body.title || existingProduct.title; //pour changer tt les mots pareille faire ctrl+d apres l'avoir selectionner
		existingProduct.description = req.body.description || existingProduct.description;
		existingProduct.price = req.body.price || existingProduct.price;
		// Vérifier si une nouvelle iage est télécharger, mettre a jour le chemin de l'image
		if (req.file) {
			// Supprimer l'ancienne image si il y en a une
			if (existingProduct.image) {
				fs.unlinkSync(existingProduct.image);
			}
			existingProduct.imageUrl = req.file.path;
		}
		// Enregistré les modification dans la bdd
		const updateProduct = await existingProduct.save();
		// Réponse de succès
		res.status(200).json({ message: 'Produit mis a jour avec succès', product: updateProduct });
	} catch (error) {
		// Réponse erreur serveur
		console.error('Erreur lors de la modification du produit : ', error.message);
		res.status(500).json({ message: 'Erreur lors de la modification du produit' });
	}
};
