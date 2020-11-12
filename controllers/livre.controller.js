const mongoose= require("mongoose");
const livreSchema = require("../models/livres.modele");//.. je remonte d un cran avant d'aller dans models
const auteurSchema = require("../models/auteurs.modele");
const fs = require("fs"); //module fs permet utiliser fonction unlink pour supp fichier


/**AFFICHER LISTE DES LIVRES */
exports.livres_affichage= (requete, reponse) =>{ //des qu il y a une route on lance une fonction
    auteurSchema.find()
    .exec()
    .then(auteurs =>{
        livreSchema.find() //recup tous les livres
        .populate("auteur") // detail du champs auteur
        .exec() // exec pour executer la requete 
        .then(livres =>{      // then pour traiter le resultat
            reponse.render("livres/liste.html.twig", {
                liste : livres,
                auteurs :auteurs, 
                message: reponse.locals.message });// affiche dans le navigateur -- fonction render pour renvoyer un fichier
        })
        .catch(error =>{
            console.log(error);
        }) // pour traiter les erreurs
    
    .catch(error =>{
        console.log(error);
    });

    })
   
}


/** AOUTER UN LIVRE */
exports.livres_ajout= (requete, reponse) =>{ //des qu il y a une route on lance une fonction
    const livre =new livreSchema({
        _id : new mongoose.Types.ObjectId(),
        nom : requete.body.titre,
        auteur : requete.body.auteur,
        pages : requete.body.pages,
        description : requete.body.description,
        image : requete.file.path.substring(14) // enleve les 14 premiers caracteres pour ne garder que la fin
    })
    
    livre.save()
    .then(resultat =>{
        console.log(resultat);
        reponse.redirect("/livres");

    })
    .catch(error =>{
        console.log(error);
    })
    //console.log(requete.body);//affiche dans le serveur (terminal) |body avec body-parser
   // reponse.end(" demande POST reçue");// affiche dans le navigateur

}


/**ACHICHER le detail d'UN LIVRE */
exports.livre_affichage= (requete, reponse) =>{ //des qu il y a une route on lance une fonction
    
    livreSchema.findById(requete.params.id)
    .populate("auteur") // pour developpeur le champs auteur (type, ref, ...)qui est dans livres.modele.js
    .exec()
    .then(livre =>{
        reponse.render("livres/livre.html.twig", {livre : livre, isModif:false});// pour envoyer une info a un template on utilse {} "objet" puis un propriete "livre"(par ex)puis l'information"livre"

    })
    .catch(error =>{
        console.log(error);
    })
    
}

/** MODIFIER UN LIVRE FORM */
exports.livre_modification =(requete, reponse)=>{
    auteurSchema.find()
    .exec()
    .then(auteurs =>{
        livreSchema.findById(requete.params.id)
        .populate("auteur")
        .exec()
        .then(livre =>{
            reponse.render("livres/livre.html.twig", {
                livre : livre, 
                auteurs: auteurs,
                isModif:true});// pour envoyer une info a un template on utilse {} "objet" puis un propriete "livre"(par ex)puis l'information"livre"

        })
        .catch(error =>{
            console.log(error);
        })
    .catch(error =>{
        console.log(error);
    })

    })
    
    
}

/** MODIFIER UN LIVRE SERVER*/
exports.livre_modification_validation = (requete, reponse)=>{
    //console.log(requete.body)

    const livreUpdate = {
        nom : requete.body.titre,
        auteur: requete.body.auteur,
        pages : requete.body.pages,
        description : requete.body.description
    }
    livreSchema.update({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
        if(resultat.nModified <1){ //si le nombre d element modif est inferieur a 1 alors erreur sinon on poursuit le code
            throw new Error ("requète de modif echouée")
        }
        requete.session.message={
            type:"success",
            contenu:"modification effectuée"
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        console.log(error);
        requete.session.message={
            type:"danger",
            contenu:error.message
        }
        reponse.redirect("/livres");
    })
}

/** MODIFIER UNE IMAGE */
exports.livre_modification_image = (requete, reponse)=>{

    var livre = livreSchema.findById(requete.body.identifiant) // on recup le livre
    .select("image")// on recup img
    .exec()
    .then(livre=>{
        fs.unlink("./public/images/" + livre.image, error =>{    //unlink pour supp fichier
            console.log(error);
        })
        const livreUpdate = { //on modif en bd
            image : requete.file.path.substring(14)
        }
        livreSchema.update({_id:requete.body.identifiant}, livreUpdate)
        .exec()
        .then(resultat => {
            reponse.redirect("/livres/modification/" + requete.body.identifiant);      
            
        })
        .catch(error => {
            console.log(error);
        })
    })
}
/** SUPPRIMER UN LIVRE */
exports.livre_suppression = (requete, reponse) =>{
    var livre = livreSchema.findById(requete.params.id)
    .select("image")
    .exec()
    .then(livre=>{
        fs.unlink("./public/images/" + livre.image, error =>{    //unlink pour supp fichier
            console.log(error);
        })
        livreSchema.remove({_id:requete.params.id})
            .exec()
            .then(resultat => {
                requete.session.message={
                    type:"success",
                    contenu:"suppression effectuée"
                }
                reponse.redirect("/livres");
            })
            .catch(error => {
                console.log(error);
            })
    })
    .catch(error => {
        console.log(error);
    })
    
}



