const express = require('express');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');

const userRoutes = require('./routes/user');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://adrienpnr:Police31@cluster0.z6ozv.mongodb.net/test?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true}) 
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api/sauces', saucesRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;