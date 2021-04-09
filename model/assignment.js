let mongoose = require('mongoose');

var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    auteur : { type: Schema.Types.ObjectId, ref: 'Eleve' },
    matiere : { type: Schema.Types.ObjectId, ref: 'Matiere' },
    note : Number,
    remarques: String

});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
