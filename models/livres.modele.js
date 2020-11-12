const mongoose = require("mongoose");

//creation du schema mongoose
const livreSchema =mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nom : String,
    auteur : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Auteur",
        required : true
    },
    pages : Number,
    description : String,
    image : String,

})

//pour faire l'association avec la BD
module.exports = mongoose.model("Livre", livreSchema);//association entre notre collection et notre modele