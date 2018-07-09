const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');

//modelos

const Usuario = require('../models/usuario');


const Medico = require('../models/medico');


const Hospital = require('../models/hospital');


app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            message:'Error, no hay archivos'
        });
    }
    //obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreDividido = archivo.name.split('.');
    let extension = nombreDividido[nombreDividido.length-1];
    let extensionesValidas = ['png','jpg','gif','jpeg'];
    if ( extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            message:'Error, entension no valida',
            extensiones_validas : extensionesValidas.join(', ')
        });
    }

    //nombre de archivo personalizado

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //tipo de coleccion

    let tiposValidos = ['hospitales','medicos','usuarios']

    if(tiposValidos.indexOf(tipo)<0) {
        return res.status(400).json({
            message:'Error, tipo no valido'
        });
    }

    //mover archivo temporal a un path

    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                message:'Error, al mover archivo'
            }); 
        }

        subirPorTipo(tipo, id ,nombreArchivo, res);

    })

})

function subirPorTipo(tipo, id ,nombreArchivo, res) {
    if (tipo === 'usuarios'){
        Usuario.findById(id).then(
            (usuario)=> {
                let pathViejo = './uploads/usuarios/'+usuario.img;
                //borrar imagen anterior
                if (fs.existsSync(pathViejo)){
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = nombreArchivo;
                return usuario.save();
            }
        )
        .then( (usuarioActualizado ) => res.status(200).json({message:'Imagen actualizada', usuarioActualizado}))
        .catch( err => res.status(500).json({message:'error al suibir imagen'}))
    }

    if (tipo === 'medicos'){
    
        Medico.findById(id).then(
            (medico) => {
                let pathViejo = './uploads/medicos/'+medico.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                medico.img = nombreArchivo;
                return medico.save();
            }
        ).then(
            (medicoGuardado) => res.status(200).json({message:'Imagen guardada', medicoGuardado})
        ).catch( err => res.status(500).json({message:'error al suibir imagen'}));
    }

    if (tipo === 'hospitales'){
        Hospital.findById(id).then(
            (hospital) => {
                let pathViejo = './uploads/hospitales/'+hospital.img;
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }
                hospital.img = nombreArchivo;
                return hospital.save();
            }
        ).then(
            (hospitalGuardado) => {
                console.log('xd');
                res.status(200).json({message:'Imagen guardada', hospitalGuardado})
            }
        ).catch( err => res.status(500).json({message:'error al subir imagen',err}));
    }
}


module.exports.UploadRoutes = app;