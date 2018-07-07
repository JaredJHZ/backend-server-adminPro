let Usuario = require('../models/usuario');
let jwt = require('jsonwebtoken');
let {key} = require('../config/config');

let authToken = (req , res , next) => {
    if(req.query.token) {
        let token = req.query.token;
        jwt.verify(token,key, (err, decoded) => {
            if (err) {
                res.status(401).json({messsage:'invalid token'});
            } else{
                console.log(decoded);
                next();
            }
        })
    } else {
        res.status(401).json({message:'error en el token'});
    }
};

module.exports = {authToken};