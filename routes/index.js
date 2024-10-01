var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('index');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
