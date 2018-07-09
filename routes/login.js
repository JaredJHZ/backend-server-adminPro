const express = require('express');
const bcrypt = require('bcryptjs');
const {key} = require('../config/config');
let app = express();
const jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');
let {CLIENT_ID} = require('../config/config');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

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

//autentiacion google
async function verify(token) {
    console.log(token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req,res) => {
    let token = req.body.token;
    try{
        let googleUser = await verify(token);
        Usuario.findByEmail(googleUser.email).then(
            (usuario) => {
                if( usuario) {
                if(usuario.google === false){
                    return res.status(400).json({
                        message:'Debe de usar autenticacion normal'
                    });
                } else{
                    jwt.sign({usuario},key,{expiresIn:5000},(err , token) => {
                        res.status(200).json({
                            usuario,
                            token
                        });
                    });
                }
            }else {
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save().then(
                    (usuarioGuardado) => 
                        {
                            jwt.sign({usuarioGuardado},key,{expiresIn:5000},(err , token) => {
                                res.status(200).json({
                                    usuarioGuardado,
                                    token
                                });
                            });
                       
                    });
                
            }
        }
        ).catch(err => res.status(500))
    }catch{
        return res.status(403).json({
            message:'Error en el token'
        });
    }
    
})


module.exports.loginRoutes = app;