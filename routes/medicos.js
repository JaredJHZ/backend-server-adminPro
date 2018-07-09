const express = require('express');
const app = express();
let {authToken} = require('../middlewares/authentication');
let Medico = require('../models/medico');
app.post('/:hospital', authToken , (req, res) => {
    if (req.params.hospital && req.usuario) {
        let body = req.body;
        let medico = new Medico({
            nombre: body.nombre,
            img : body.img,
            usuario: req.usuario.usuario._id,
            hospital: req.params.hospital
        });

        medico.save().then(
            (medicoGuardado) => res.status(206).json({message:'Medico guardado',medicoGuardado}))
        .catch(err => res.status(500).json({message:'error al guardar medico',err}));
    }
});

app.put('/:id', authToken, (req, res) => {
    if(req.params.id && req.usuario) {
        let body = req.body;
        Medico.findByIdAndUpdate(req.params.id, {$set:body}, {new:true}).then(
            (medicoActualizado) => res.status(206).json({message:'Medico actualizado', medicoActualizado})
        ).catch( err => res.status(500).json({message:'error actualizando el medico', err}));
    }
});

app.get('/' , (req,res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde); 
    Medico.find({})
    .populate('usuario','nombre email')
    .populate('hospital', 'nombre')
    .skip(desde)
    .limit(5)
    .then( 
        (medicos) => res.status(200).json({cantidad:medicos.length, medicos})
    ).catch( err => res.status(500).json({message:'Error en la base de datos', err}));
});


app.delete('/:id', authToken, (req, res)=> {
    let id = req.params.id;
    if (id) {
        Medico.deleteOne({_id:id}).then( ok => res.status(200).json({message:'medico borrado'})).catch( err => res.status(500).json({message:'error borrando medico'}));
    }else{
        res.status(401).json({message:'No se encontro el medico'});
    }
});



module.exports.MedicoRoutes = app;