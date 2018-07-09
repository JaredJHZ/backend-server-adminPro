const express = require('express');
const app = express();
let Hospital = require('../models/hospital');
const {authToken} = require('../middlewares/authentication');

app.post('/',authToken,(req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message:'No has enviado informacion'
        });
    }
    let body = req.body;
    console.log(req.usuario);
    let hospital = new Hospital({
        nombre:body.nombre,
        img: body.img,
        usuario: req.usuario.usuario._id
    });
    
    hospital.save().then(
        (hospitalGuardado) =>{
            res.status(206).json({message:'Hospital creado', hospitalGuardado});
        }
    ).catch((error)=> res.status(500).json({message:'error guardando Hospital', error}));
});

app.get('/', (req,res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde); 
    Hospital.find({})
    .populate('usuario','nombre email')
    .skip(desde)
    .limit(5)
    .then(
        (hospitales) => {
            res.status(200).json({cantidad:hospitales.length, hospitales});
        }
    ).catch(error => res.status(500).json({message:'error en la base de datos', error}));
});

app.put('/:hospitalId', authToken , (req, res) => {
    let id = req.params.hospitalId;
    Hospital.findByHospitalId(id).then(
        (hospital) => {
            const body = req.body;
            return Hospital.findOneAndUpdate({_id:hospital.id},{$set:body},{new:true});
        }
    )
    .then(hospitalActualizado => res.status(206).json({message:'Hospital actualizado', hospitalActualizado}))
    .catch( error => res.status(500).json({message:'error actualizando', error}));
});

app.delete('/:hospitalId', authToken, (req, res)=> {
    let id = req.params.hospitalId;
    if (id) {
        Hospital.deleteOne({_id:id}).then( ok => res.status(200).json({message:'Hospital borrado'})).catch( err => res.status(500).json({message:'error borrando hospital'}));
    }else{
        res.status(401).json({message:'No se encontro el hospital'});
    }
});

module.exports.HospitalRoutes = app;