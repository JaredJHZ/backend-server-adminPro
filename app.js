const express = require('express');
const {mongoose} = require('./bd');
var app = express();

app.get('/',(req,res) => {
    res.status(200).json({
        status:200,
        message:'Ok'
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
    
});