const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	title: {
		type: String,
		required: [true, 'Veuillez entrer le nom du produit'],
	},
	description: {
		type: String,
		required: [true, 'Veuillez renseigner la description du produit'],
	},
	price: {
		type: Number,
		required: true,
	},
	// img: {
	// 	type: String,
	// 	required: true,
	// },
	timestamp: {
		type: Date,
		default: Date.now,
	},
});
// Export du modèle, du schema et mis dans la variable article
const product = mongoose.model('product', productSchema);

// Export de la variable article
module.exports = product;
