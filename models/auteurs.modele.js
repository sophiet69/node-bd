const mongoose = require("mongoose");

//creation du schema mongoose
const auteurSchema =mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom : String,
    prenom : String,
    age : Number,
    sexe : Boolean,
    

})
 /** le virtual sert a faire le lien entre l'auteur et les livres qu il a écrit */
auteurSchema.virtual("livres", {
    ref :"Livre", // collection concernée
    localField:"_id", // champ qui fait le lien
    foreignField:"auteur",
})

//pour faire l'association avec la BD
module.exports = mongoose.model("Auteur", auteurSchema);//association entre notre collection et notre modele