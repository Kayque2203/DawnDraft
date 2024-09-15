var Historias = require('../models/mHsitorias');
var tratamentoParametroDeRota = require('../assets/tratamentoParametroRota');

exports.buscaHistoria = async (req, res, next) => {

    try {

        var historiaBuscada = await Historias.buscaHistoria(tratamentoParametroDeRota(req.params.idHistooria));

        if (historiaBuscada == null) {
            res.json('Historia Não existe');
        } else{
            res.render('historias', {historia: historiaBuscada});
        }

    } catch (error) {
        next(error)
    }

}

exports.atualizaHistoria = async (req, res, next) => {

    try

}