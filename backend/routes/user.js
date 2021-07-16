const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Va chercher les demandes correspondantes suivant la demande: soit un log soit un sign
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;