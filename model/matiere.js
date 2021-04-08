let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let MatiereSchema = Schema({
    id: Number,
    nom : String,
    image: String,
    nomProfesseur : String,
    imageProfesseur : String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Matiere', MatiereSchema);
