const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({message: 'Sacue enregistrée !'}))
    .catch((error) => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

exports.getSauces = (req, res, next) =>{
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(() => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) =>{
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
  Sauce.updateOne({_id: req.params.id}, { ...sauceObject,_id: req.params.id})
    .then(() => res.status(200).json({message: 'Objet modifié'}))
    .catch((error) => res.status(400).json({ error }))
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Objet supprimé'}))
          .catch((error) => res.status(400).json({ error }))
      })
    })
    .catch((error) => res.status(500).json({ error }))
};

exports.likeOrDislikeSauce = (req, res, next) => {
  
  const likeStatus = req.body.like;
  const userId = req.body.userId;
  const thisSauce = req.params.id;

  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const userVote = sauce.usersLiked.indexOf(userId);
      const userVoteDisliked = sauce.usersDisliked.indexOf(userId);

      if(likeStatus === 1){
        console.log(userId +" aime la sauce.");
          Sauce.updateOne(
            {_id: thisSauce},
            {$push: {usersLiked: userId}, $inc: {likes: +1},}
          )
            .then(() => res.status(200).json({message: "Vous aimez cette sauce !"}))
            .catch((error) => res.status(400).json({ error }))
        }

      if(likeStatus === -1){
        console.log(userId +" n'aime pas la sauce.");
          Sauce.updateOne(
            {_id: thisSauce},
            {$push: {usersDisliked: userId}, $inc: {dislikes: +1},}
          )
            .then(() => res.status(200).json({message: "Vous n'aimez pas cette sauce !"}))
            .catch((error) => res.status(400).json({ error }))
        }

      if(likeStatus === 0){
        if(userVote > -1){
          sauce.usersLiked.slice(userVote, 1);
          Sauce.updateOne(
            {_id: thisSauce},
            {$push: {usersLiked: {$each: [], $slice: userVote}}, $inc: {likes: -1},}
          )
            .then(() => res.status(200).json({message: "Vous retirez votre vote positif"}))
            .catch((error) => res.status(400).json({ error }))
        } else if(userVote === -1){
          sauce.usersDisliked.slice(userVote, 1);
          Sauce.updateOne(
            {_id: thisSauce},
            {$push: {usersDisliked: {$each: [], $slice: userVoteDisliked}}, $inc: {dislikes: -1},}
          )
            .then(() => res.status(200).json({message: "Vous retirez votre vote négatif"}))
            .catch((error) => res.status(400).json({ error }))
        }
      }
    })
}