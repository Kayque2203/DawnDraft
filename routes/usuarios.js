var express = require('express');

var router = express.Router();

router.get('/:idUsuario', (req,res) => {
    res.render('Usuarios', {idUsuario : req.params.idUsuario} );
})

module.exports = router;