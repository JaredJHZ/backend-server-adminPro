let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
    nombre:{
        type: String,
        required : [true, 'El nombre es requerido']
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref:'Usuario'
    }
},{collection: 'hospitales'});


hospitalSchema.statics.findByHospitalId = function(id){
    hospital = this;
    return hospital.findOne({
        '_id':id
    });
}

module.exports = mongoose.model('Hospital',hospitalSchema);