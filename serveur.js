var express =require("express"); //recupere le modul express
var server = express(); // pour lancer express et je l'assigne dans une variable
var morgan =require("morgan");
var routerLivre= require("./routeurs/livres.routeur");
var routerGlobal= require("./routeurs/global.routeur");
const routerAuteur = require("./routeurs/auteurs.routeur");
const mongoose =require("mongoose");
const bodyParser = require("body-parser"); // pour manipuler les infos sur le serveur on installe module body-parser pour traiter les url et info postés
const session =require("express-session");


server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }//60 000 milisecondes soit 6 sec
  }))

mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology:true});


server.use(express.static("public"));//pour récup le fichier public || permet de renvoyer des fichier client pour paramettrer du css personalisé avec expressJs
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false})); //informe le serveur qu il est capable d'utiliser bady-parser
server.set("trust proxy", 1);//express-session recommande cette action pour le proxy voir documentation 

server.use((requete, reponse, suite)=>{
    reponse.locals.message = requete.session.message; // je mets en reponse en locale un message qui a été recup dans ma requete de session
    delete requete.session.message; // puis je supprime l info
    suite();
})

server.use("/livres", routerLivre);// pour les routes commencant par / il ira chercher dans notre fichier qui s appelle livres.routeur.js 
server.use("/auteurs", routerAuteur);// mettre les routes avant le global


server.use("/", routerGlobal);// pour les routes commencant par / il ira chercher dans notre fichier qui s appelle globale.routeur.js 

server.listen(8080); // sur quel port cela ecoute

