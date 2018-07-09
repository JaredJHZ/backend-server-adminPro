const express = require('express');
const {mongoose} = require('./bd');
const bodyP = require('body-parser');
var app = express();

// rutas

var {serverRoutes} = require('./routes/server');
var {UsuarioRoutes} = require('./routes/usuario');
var {loginRoutes} = require('./routes/login');
var {HospitalRoutes} = require('./routes/hospital');
var {MedicoRoutes} = require('./routes/medicos');
var {BusquedasRoutes} = require('./routes/busqueda');
var {UploadRoutes} = require('./routes/upload');
var {ImagenesRoutes} = require('./routes/imagenes');
//body parser

app.use(bodyP.urlencoded({extended:false}));
app.use(bodyP.json());


// implementaciion de rutas
app.use( '/',serverRoutes);
app.use('/usuarios',UsuarioRoutes);
app.use('/login', loginRoutes); 
app.use('/hospital',HospitalRoutes);
app.use('/medico',MedicoRoutes);
app.use('/busqueda',BusquedasRoutes);
app.use('/upload',UploadRoutes);
app.use('/img',ImagenesRoutes);
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online'); 
});