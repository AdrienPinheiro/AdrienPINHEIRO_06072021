const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces')
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth')

// Amène suivant les demandes (POST / GET et autres) de chercher une réponse différente
// Permet de rajouter des modules et middleware (sécurité) sur les différentes réponses
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like', saucesCtrl.likeOrDislikeSauce);

router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getSauces);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);

module.exports = router;