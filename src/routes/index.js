const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); //Ya esta configurado ya no es necesario especificar index.hbs
    //res.send("hola");
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;