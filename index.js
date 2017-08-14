const express = require('express');
const server = express();
const words = require('./utils/cloud-words');

server.use(express.static('public'));

server.get('/api/gender/:gender', function (req, res) {
    words.calculate(req.params.gender)
        .then(cloud => res.status(200).json(cloud))
        .catch(error => {
            console.log(error);
            res.status(400).json(error);
        });
});

server.listen(3001, function (error) {
    if (error) {
        console.error(error);
        return;
    }
    console.log('Conectado al puerto 3000');
})