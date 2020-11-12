var express = require("express");//recupere le module express
var routeur = express.Router();// fonction Router() dispo avec express
const twig = require("twig"); //recup twig
const livreController = require("../controllers/livre.controller");

/** pour upload image */
const multer = require("multer");

const storage= multer.diskStorage({
    destination : (requete, file, cb)=>{    // destination
    cb(null, "./public/images/")
  },
  filename: (requete, file, cb)=>{ // nom du fichier
    var date = new Date().toLocaleDateString();
    cb(null, date + "-" + Math.round(Math.random() * 10000) + "-" + file.originalname)
  }
});

const fileFilter = (requete, file, cb)=>{
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){ //minetype: type du fichier
      cb(null, true)  }
  else{
      cb(new Error("l'image n'est pas acceptée "))
  }
}

const upload = multer({
  storage : storage,
  limits:{
    fileSize : 1024 * 1024 * 5
  },
  fileFilter : fileFilter
})
/** fin upload image */


routeur.get("/",livreController.livres_affichage );
routeur.post("/", upload.single("image"), livreController.livres_ajout);

/** route pour afficher un livre */
routeur.get("/:id", livreController.livre_affichage );

/**route pour modif livre (formulaire) */
routeur.get("/modification/:id", livreController.livre_modification )

/*modif en bd */
routeur.post("/modificationServer", livreController.livre_modification_validation)

/**modif image */
routeur.post("/updateImage", upload.single("image"), livreController.livre_modification_image )

/** route pour supprimer un livre */
routeur.post("/delete/:id", livreController.livre_suppression);

module.exports = routeur; //exporte le router pour que le esrveur puisse l utiliser
