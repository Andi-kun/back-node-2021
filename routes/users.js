let User = require('../model/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../config.json');

function login(req,res){
    const {login, password} = req.body;
    console.log(login);
    console.log(password);
    User.findOne({ login: login, password: password },function(err,user){
        console.log(user);
        if(err){
            res.status(500).send(err);
            return;
        }

        if(!user){
            res.status(404).send("Login ou mot de passe incorrecte");
            return;
        }
        
        var userData = {
            "id" : user.id,
            "login": user.login,
            "role": user.role,
        }
        let token = jwt.sign(userData, secret, { expiresIn: '3600s'})
        res.status(200).json({"token": token});
    });
}

module.exports ={
    login
}