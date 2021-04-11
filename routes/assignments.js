// Assignment est le "modèle mongoose", il est connecté à la base de données
let Assignment = require("../model/assignment");
let Matiere = require("../model/matiere");

/* Version sans pagination */
// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

// Récupérer tous les assignments (GET), AVEC PAGINATION
function getAssignments(req, res) {
  let options = [];

  console.log(req.query.rendu);
  if(req.query.rendu){
    options.push({ "$match": { "rendu": JSON.parse(req.query.rendu.toLowerCase()) }});
  }
  console.log(options);
  var aggregateQuery = Assignment.aggregate(options);
  
  Assignment.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }
      Assignment.populate(assignments.docs, [{path: "auteur"},{path: "matiere"}],(err, assignmentsPopulate) => {
        if (err) {
          res.send(err);
        }
        assignments.docs = assignmentsPopulate;
        res.send(assignments);
      } );
    }
  );
}


// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findOne({ id: assignmentId })
  .populate("auteur")
  .populate("matiere")
  .exec((err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json(assignment);
  });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  let assignment = new Assignment();
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.auteur = req.body.auteur;
  assignment.matiere = req.body.matiere;
  assignment.rendu = req.body.rendu || false;
  assignment.note = req.body.note;
  assignment.remarques = req.body.remarques;
  
  console.log("POST assignment reçu :");
  console.log(assignment);

  assignment.save((err) => {
    if (err) {
      res.send("cant post assignment ", err);
    }
    res.json({ message: `${assignment.nom} saved!` });
  });

  /*Matiere.findOne({ id: matiereId }, (err, matiere) => {
    if (err) {
      res.send(err);
    }
    
    assignment.matiere = matiere;
    assignment.save((err) => {
      if (err) {
        res.send("cant post assignment ", err);
      }
      res.json({ message: `${assignment.nom} saved!` });
    });
  });*/
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);
  if(req.body.note){
    req.body.rendu = true;
  }
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.json({ message: "updated" });
      }

      // console.log('updated ', assignment)
    }
  );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  });
}

module.exports = {
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
