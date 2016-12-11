// grab the packages we need
var express = require('express');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 8081;
var fs = require("fs");
var parser = require('xml2json');
var paginate = require('express-paginate');
var responseRange = require('express-response-range');
app.use(cors());
var options = {};
app.use(responseRange(options));


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({	extended: true })); // support encoded bodies

// routes will go here

// ====================================
// URL PARAMETERS =====================
// ====================================
// http://localhost:8080/getJSONData?filename=

app.get('/getJSONData', function(req, res, next) {
  	var filename = req.param('filename');
	//console.log("Request param "+ filename);
	//res.send(filename);
	var options = {
	    object: false,
	    reversible: false,
	    coerce: false,
	    sanitize: true,
	    trim: true,
	    arrayNotation: false
	};
	var testData = null;
	fs.readFile( __dirname + "/data/" + req.param('filename'), 'utf8', function (err, data) {
       //console.log( parser.toJson(data));
       res.end( parser.toJson(data,options) );
       //testData = parser.toJson(data,options);
       
   });
	// var slicedData = testData.slice(req.range.offset, req.range.offset + req.range.limit);
 //   return res.sendRange(slicedData,slicedData.length);

});


// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);