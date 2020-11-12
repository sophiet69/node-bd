var express = require("express");//recupere le module express
var routeur = express.Router();// fonction Router() dispo avec express
const twig = require("twig"); //recup twig

const auteurController = require("../controllers/auteur.controller");

routeur.get("/:id",auteurController.auteur_affichage);
routeur.get("/",auteurController.auteurs_affichage);
routeur.post("/",auteurController.auteurs_ajout);
routeur.post("/delete/:id",auteurController.auteur_suppression);
routeur.get("/modification/:id",auteurController.auteur_modification);
routeur.post("/modificationServer",auteurController.auteur_modification_validation);



module.exports = routeur; //export de mon fichier de routeur