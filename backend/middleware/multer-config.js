const multer = require('multer');

// Change les formats d'image en JPG
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

// Prend le dossier "images" et stock les images en ajoutant la date dans le nom de l'image pour éviter des doublons
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.minetype];
        callback(null, name + Date.now() + '.' + extension);
    }
})

module.exports = multer({storage}).single('image');