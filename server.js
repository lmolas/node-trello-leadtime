// server.js
'use strict';

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 
var trelloRouter = require('./src/trelloRouter.js');// define our app using express
//var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', trelloRouter);


//Middleware error handler !
app.use(function(error, req, res , next){
	console.error(error);
	//Send the JSON error
	res.json(error);
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
