const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let {authToken} = require('../middlewares/authentication');
var app = express();
const {key} = require('../config/config');

var Usuario = require('../models/usuario');
//obtener usuarios
app.get('/', (req,res) => {
    Usuario.find({},'nombre email img role')
    .exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: 'false',
                message: 'Error en la base de datos, no se encontraron los usuarios',
                error: err
            });
        }
        
        res.status(200).json({
            ok: 'true',
            cantidad: usuarios.length ,
            usuarios
        });

        }
    );
});
//Crear usuario

app.post('/', (req,res) => {

    let body = req.body;

   if (body.password) {
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role,

    });

    usuario.save( (err,usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: 'false',
                message: 'no se pudo guardar el usuario',
                error: err
            });
        }

        jwt.sign({usuarioGuardado},key,{expiresIn:5000},(err , token) => {
            res.status(200).json({
                message: 'usuario guardado',
                usuarioGuardado,
                token
            });
        });
    });
   }

});

app.put('/:id', authToken,(req, res) => {
    Usuario.findById(req.params.id).then(
        (usuario) => {
            const body = req.body;
            Usuario.findOneAndUpdate({_id:usuario.id},{$set:body},{new:true}).then(
                (usuario) => res.status(200).json({usuario}))
        }
    ).catch(
        (error) => res.status(404).json({'message':'No existe usuario', error})
    );
});

app.delete('/:id',authToken ,(req, res) => {
    Usuario.findById(req.params.id).then(
        (usuario)=> {
            Usuario.deleteOne(usuario).then(
                (usuarioEliminado) => {
                    res.status(206).json({message:'usuario eliminado'});
                }
            )
        }
    ).catch(error => res.status(400).json({error}));
});

module.exports.UsuarioRoutes = app;