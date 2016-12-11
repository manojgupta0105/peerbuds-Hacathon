var express = require('express');
var router = express.Router();
var fs = require("fs");
var parser = require('xml2json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/getJSONData',function(req,res){
	var user_id = req.query.id;
	var token = req.query.token;
	var geo = req.query.geo;
	console.log(user_id + ' ' + token + ' ' + geo);

	var filename = req.param('filename');
	console.log("Request param "+ filename);
	fs.readFile( __dirname + "/../data/" + req.param('filename'), 'utf8', function (err, data) {
       console.log( parser.toJson(data));
       res.end( parser.toJson(data) );
   });
})

module.exports = router;
