const express = require('express');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const app = express();

app.get('/todo/:busqueda' , async(req,res) => {
    let busqueda = req.params.busqueda;
    let resultados = await hacerBusquedaGeneral(busqueda);
    res.status(200).json(resultados);
});

app.get('/coleccion/:tabla/:busqueda', async(req,res) => {
    if (req.params.tabla && req.params.busqueda){
        let tabla = req.params.tabla;
        let busqueda = req.params.busqueda;
        let resultado = await hacerBusqueda(tabla,busqueda);
        res.status(200).json({resultado});
    }
});

let hacerBusquedaGeneral = async function(busqueda){
    let regex = new RegExp(busqueda, 'i');
    let hospitales = await Hospital.find({nombre:regex}).populate('usuario', 'nombre email').exec();
    let usuarios = await Usuario.find({},'nombre email role').or([{nombre:regex},{email:regex}]).exec();
    let medicos = await Medico.find({nombre:regex}).populate('usuario', 'nombre email').populate('hospital').exec();
    return {hospitales, usuarios, medicos};
}

let hacerBusqueda = async function(coleccion, busqueda) {
    let regex = new RegExp(busqueda, 'i');
    if (coleccion === 'hospitales') {
        let resultados =await Hospital.find({nombre:regex})
        .populate('usuario', 'nombre email')
        .exec();
        return resultados;
    }
    if(coleccion === 'usuarios'){
        let resultados = await Usuario.find({},'nombre email role')
        .or([{nombre:regex},{email:regex}]).exec();
        return resultados;
    }
    if (coleccion === 'medicos') {
        let resultados = await Medico
        .find({nombre:regex}).populate('usuario', 'nombre email')
        .populate('hospital').exec();
        return resultados;
    }
}


module.exports.BusquedasRoutes = app;