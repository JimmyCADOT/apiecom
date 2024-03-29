const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Auth',
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	imageUrl: {
		type: String,
	},
	imagePublicId: {
		type: String,
		default: null,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});
// Export du modèle, du schema et mis dans la variable article
const product = mongoose.model('product', productSchema);

// Export de la variable article
module.exports = product;
