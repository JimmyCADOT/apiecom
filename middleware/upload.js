// Import du package multer
const multer = require('multer');

// Configuration de multer pour stacker les images dans un dossier spécifique
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Le dossier ou les images seront stockées
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
