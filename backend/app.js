const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize')
const path = require('path')


const saucesRoutes = require('./routes/sauces');

const userRoutes = require('./routes/user');

const app = express();

// Permet l'autorisation des demandes de type POST / GET / PUT et autre
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Permet la connexion à MongoDB et de renvoyer dans le terminal si la connexion est réussi ou non
mongoose.set('useCreateIndex', true);
mongoose.connect( process.env.MONGO_DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true}) 
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Permet de json le contenue des échanges
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Permet d'aller les chercher les routes pour les différentes fonctionnalités (les sauces et les log/sign)
// Va chercher les images
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', saucesRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;