const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces')
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth')
const sauces = require('../models/sauces');

router.post('/', auth, multer, saucesCtrl.createSauce);

router.get('/:id', auth, multer, saucesCtrl.getOneSauce);
router.get('/', auth, multer, saucesCtrl.getSauces);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, multer, saucesCtrl.deleteSauce);

module.exports = router;