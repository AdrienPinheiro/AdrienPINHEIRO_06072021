const sauces = require('../models/sauces')

exports.createSauces = (req, res, next) => {
    delete req.body._id;
    const sauces = new sauces({
      ...req.body
    });
    sauces.save()
      .then(() => res.status(201).json({message: 'object enregistré'}))
      .catch(() => res.status(400).json({error}));
    };
