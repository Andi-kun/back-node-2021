let express = require('express');
let bodyParser = require('body-parser');
const jwt           = require('jsonwebtoken');
var expressJWT      = require('express-jwt');
let app = express();


let assignment = require('./routes/assignments');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://mb:P7zM3VePm0caWA1L@cluster0.zqtee.mongodb.net/assignments?retryWrites=true&w=majority';
const uri='mongodb+srv://andi:1234@cluster0.atmdc.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use((req, res, next) =>  {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

let secret = 'some_secret';

app.route(prefix+'/auth')
.get((req, res) => {
    var userData = {
        "name": "My Name",
        "id": "1234"
    }
    let token = jwt.sign(userData, secret, { expiresIn: '1800s'})
    res.status(200).json({"token": token});
});

app.use(expressJWT({ secret: secret, algorithms: ['HS256']})
    .unless(
        { path: [
            prefix+'auth'
        ]}
));

app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);


app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré  sur http://localhost:' + port);

module.exports = app;


