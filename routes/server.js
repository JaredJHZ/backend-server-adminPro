const express = require('express');

const app = express();

app.get('/', (req,res) => {
    res.status(200).json({
        ok: true,
        message:'todo bien, al cien'
    })
});

module.exports.serverRoutes = app;