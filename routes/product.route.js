const router = require('express').Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/authenticate');
const cloudinaryUpload = require('../middleware/cloudinaryUpload');

// Route pour la création d'un produit en tant qu'admin en prenant en compte authMiddleware.authenticate
router.post(
	'/create-product',
	authMiddleware.authenticate,
	cloudinaryUpload,
	productController.createProduct
);

// Route pour recupérer tous les produits
router.get('/all-products', productController.getAllProducts);

//Route pour récupérer un seul produit avec son id
router.get('/product/:id', productController.getProductById);

//Route pour modifier un produit (accessible uniquement par l'admin)
router.put(
	'/update-product/ :id',
	authMiddleware.authenticate,
	cloudinaryUpload,
	productController.updateProduct
);
// Route pour supprimer un produit (accessible uniquement par l'admin)
router.delete(
	'/delete-product/:id',
	authMiddleware.authenticate,
	cloudinaryUpload,
	productController.deleteProduct
);
module.exports = router;
