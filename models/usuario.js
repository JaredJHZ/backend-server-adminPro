const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido '
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required:[true, 'Es necesario escribir un nombre']
    },
    email: {
        type: String,
        required: [true, 'Es necesario un correo electronico'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Es necesario un password']
    },
    img : {
        type: String
    }
    ,
    role: {
        type: String,
        required:true,
        default: 'USER_ROLE',
        enum: roles
    }
});

usuarioSchema.statics.findById = function(id) {
    Usuario = this;
    return Usuario.findOne({
        '_id':id
    });
}

usuarioSchema.statics.findByEmail = function(email) {
    Usuario = this;
    return Usuario.findOne(({email:email}));
}

usuarioSchema.plugin(uniqueValidator, {message:'{PATH} debe de ser unico'});

module.exports = mongoose.model('Usuario',usuarioSchema);