const express = require('express');
const {mongoose} = require('./bd');
const bodyP = require('body-parser');
var app = express();

// rutas

var {serverRoutes} = require('./routes/server');
var {UsuarioRoutes} = require('./routes/usuario');
var {loginRoutes} = require('./routes/login');
//body parser

app.use(bodyP.urlencoded({extended:false}));
app.use(bodyP.json());


// implementaciion de rutas
app.use( '/',serverRoutes);
app.use('/usuarios',UsuarioRoutes);
app.use('/login', loginRoutes); 

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online'); 
});