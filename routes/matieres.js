// Assignment est le "modèle mongoose", il est connecté à la base de données
let Matiere = require("../model/matiere");


function getMatieres(req, res){
    Matiere.find((err, matieres) => {
        if(err){
            res.send(err)
        }

        res.send(matieres);
    });
}
module.exports = {
  getMatieres
};
