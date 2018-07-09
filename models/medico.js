const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let medicoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El medico debe de contener un nombre']
    },
    img: {
        type: String,
        required: false
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required:[true, "El hospital debe de ser obligatorio"]
    }
});

module.exports = mongoose.model('Medico',medicoSchema);