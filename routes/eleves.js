let Eleve = require("../model/eleve");

function getEleves(req, res){
    Eleve.find((err, eleves) => {
        if(err){
            res.send(err)
        }

        res.send(eleves);
    });
}

function postEleve(req,res){
    let eleve = new Eleve();
    eleve.id = req.body.id;
    eleve.nom = req.body.nom;

    eleve.save((err) => {
        if (err) {
          res.send("cant post eleve ", err);
        }
        res.json({ message: `${eleve.nom} saved!` });
    });
}

module.exports = {
    getEleves,
    postEleve
};
