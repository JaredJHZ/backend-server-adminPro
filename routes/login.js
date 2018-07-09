const express = require('express');
const bcrypt = require('bcryptjs');
const {key} = require('../config/config');
let app = express();
const jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    let body = req.body;
  
    Usuario.findByEmail(body.email).then(
        (usuario) => {
           
            if (!bcrypt.compareSync(body.password, usuario.password)) {
               return res.status(400).json({message:'error password'});
            }
            jwt.sign({usuario},key,{expiresIn:5000},(err , token) => {
                res.status(200).json({
                    message: 'usuario guardado',
                    usuario,
                    token
                });
            });
           
        }
    ).catch( error => res.status(500).json({message:'error no email encontrado'}));
});


module.exports.loginRoutes = app;