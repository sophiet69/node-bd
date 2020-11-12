const mongoose= require("mongoose");
const auteurSchema = require("../models/auteurs.modele");//.. je remonte d un cran avant d'aller dans models
const fs = require("fs"); //module fs permet utiliser fonction unlink pour supp fichier
const livreSchema= require("../models/livres.modele");

exports.auteur_affichage =(requete, reponse)=>{
    auteurSchema.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur=>{
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModif : false});
    })
    .catch(error=>{
        console.log(error);

    })
    
}

exports.auteurs_affichage = (requete, reponse) =>{
    auteurSchema.find()
    .populate("livres")
    .exec()
    .then(auteurs=>{
        reponse.render("auteurs/liste.html.twig", {auteurs : auteurs});
    })
    .catch();
    
}

exports.auteurs_ajout =(requete, reponse) =>{
    const auteur = new auteurSchema({
        _id : new mongoose.Types.ObjectId(),
        nom : requete.body.nom,
        prenom : requete.body.prenom,
        age : requete.body.age,
        sexe : (requete.body.sexe) ? true : false,
    })
    auteur.save()
    .then(resultat=>{
        reponse.redirect("/auteurs");
    })
    .catch(error=>{
        console.log(error);
    })
}

exports.auteur_suppression = (requete, reponse) => {
    auteurSchema.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(auteur =>{// $set pour indiquer que ce sera une modification
        livreSchema.updateMany({"auteur":requete.params.id}, {"$set":{ "auteur": auteur[0]._id }}, {"multi":true})
        .exec()
        .then(
            auteurSchema.remove({_id:requete.params.id})
            .where('nom').ne("anonyme") // ne signifie not equals
            .exec()
            .then(reponse.redirect("/auteurs"))
            .catch()
        )
    })
}

exports.auteur_modification =(requete, reponse)=>{
    auteurSchema.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur=>{
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModif : true});
    })
    .catch(error=>{
        console.log(error);

    })
    
}
exports.auteur_modification_validation =(requete, reponse) =>{
    const auteurUpdate = {
        nom : requete.body.nom,
        prenom : requete.body.prenom,
        age : requete.body.age,
        sexe : (requete.body.sexe) ? true : false,
    };
    auteurSchema.update({_id:requete.body.identifiant}, auteurUpdate)
    .exec()
    .then(resultat =>{
        reponse.redirect("/auteurs");
    })
    .catch(error=>{
        console.log(error);
    })
    
}