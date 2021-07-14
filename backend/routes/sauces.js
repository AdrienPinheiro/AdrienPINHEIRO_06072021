const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces')

router.post('/', saucesCtrl.createSauces);
  
router.get('/:id', (req, res, next) => {
  sauces.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
});

router.get('/', (req, res, next) =>{
  sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(() => res.status(400).json({error}));
})

module.exports = router;