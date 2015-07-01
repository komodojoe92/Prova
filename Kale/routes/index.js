var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  res.render('index', {webserver: "http://localhost:3000"});
});

module.exports = router;
