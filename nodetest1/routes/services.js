var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/tags/?*', function(req, res) 
{
  console.log(req['path']);
  // response.simpleText(200, "Hello World!");
  request.get({ uri:'http://0.0.0.0:1234'+req['path'], json:true}, function(error,response, body){
    // console.log(body);
    res.send(body);

  });
  // res.send(, json: true);

});

module.exports = router;
