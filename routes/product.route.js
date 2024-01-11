const router = require('express').Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/authenticate');
const upload = require('../middleware/upload');

// Route pour la création d'un produit en tant qu'admin en prenant en compte authMiddleware.authenticate
router.post(
	'/create-product',
	authMiddleware.authenticate,
	upload.single('image'),
	productController.createProduct
);

// Route pour recupérer tous les produits
router.get('/all-products', productController.getAllProducts);

//Route pour récupérer un seul produit avec son id
router.get('/product/:id', productController.getProductById);

//Route pour modifier un produit (accessible uniquement par l'admin)

// Route pour supprimer un produit (accessible uniquement par l'admin)
router.delete('/delete-product/:id', authMiddleware.authenticate, productController.deleteProduct);
module.exports = router;
