const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

// Permet de s'enregistrer
// Crypte le mot de passe et l'email
// Passe la main à la fonction pour se connecter directement
exports.signup = (req, res, next) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/; 
  const password = req.body.password;

  if (password.match(regex)) {
    bcrypt.hash(password, 10)
      .then(hash => {
        const user = new User({
          email: CryptoJS.HmacSHA256(req.body.email, process.env.SECRET).toString(),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } else {
        throw new Error("Le mot de passe n'est pas assez sécurisé");
      }
};

// Permet de se connecter en vérifiant par l'email si l'utilisateur existe
// Assigne un token espirant en 24h à l'utilisateur
exports.login = (req, res, next) => {
  const emailCrypted = CryptoJS.HmacSHA256(req.body.email, process.env.SECRET).toString()
    User.findOne({ email: emailCrypted })
      .then(user => {
        if (!user) {
          return res.status(401).json({error:'Utilisateur non trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({error:'Mot de passe incorrect' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId: user._id},
                  process.env.SECRET,
                  {expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({error}));
      })
      .catch(error => res.status(500).json({error}));
  };