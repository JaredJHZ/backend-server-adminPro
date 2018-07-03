const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');

    mongoose.connect('mongodb://localhost:27017/hospitalDB')
    .then( () => console.log('Base de datos \x1b[32m%s\x1b[0m','conectada'))

    .catch( (error) => console.error('error', error));
    
exports.module = {mongoose}