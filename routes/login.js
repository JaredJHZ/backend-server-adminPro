const express = require('express');
const bcrypt = require('bcryptjs');

let app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    let body = req.body;
  
    Usuario.findByEmail(body.email).then(
        (usuario) => {
           
            if (!bcrypt.compareSync(body.password, usuario.password)) {
               return res.status(400).json({message:'error password'});
            }
            res.status(200).json({
                ok:true,
                usuario,
                id:usuario._id
            });
        }
    ).catch( error => res.status(500).json({message:'error no email encontrado'}));
});


module.exports.loginRoutes = app;