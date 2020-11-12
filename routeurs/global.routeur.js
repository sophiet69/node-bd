var express = require("express");//recupere le module express
var routeur = express.Router();// fonction Router() dispo avec express
const twig = require("twig"); //recup twig


routeur.get("/", (requete, reponse) =>{ //des qu il y a une route on lance une fonction
    
    console.log("demande reçue avec la methode GET sur l url /");//affiche dans le serveur (terminal)
    reponse.render("accueil.html.twig");// affiche dans le navigateur

});


//gerer les erreurs a la fin de la page
//gerer les erreur 404
routeur.use((requete, reponse, suite) => {
    const error = new Error ("Page non trouvée");
    error.status = 404;
    suite(error); //envoi à la route ci-dessous avec "error" générée || suite pour passer à la suite

});

//gerer toutes les erreurs
routeur.use((error,requete, reponse) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
});

module.exports = routeur; //exporte le router pour que le esrveur puisse l utiliser
