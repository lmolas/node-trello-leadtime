'use strict';

var express = require('express');
var trelloUtils = require('./trelloUtils.js');
var math = require('mathjs');
var request = require('request');
//var proxiedRequest = request.defaults({proxy: "http://127.0.0.1:3128"});
var proxiedRequest = request;


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to our trello lead time calculator !' });	
});

router.get('/myBoards', function(req, res, next){
		trelloUtils.proxiedRequestGet('https://api.trello.com/1/members/me/boards?filter=open&fields=name', res, next);
});
		

router.get('/lists/:idBoard', function(req, res, next){
	var idBoard = req.params.idBoard;

	trelloUtils.proxiedRequestGet('https://api.trello.com/1/boards/' + idBoard + '/lists?filter=open&fields=name', res, next);
});

router.get('/lead-time/:idFirstList/:idLastList', function(req,res){
	var idFirstList = req.params.idFirstList;
	var idLastList = req.params.idLastList;

	var url = trelloUtils.constructUrl('https://api.trello.com/1/lists/' + idLastList + '/cards?actions=all&fields=name&filter=all');

	console.info('GET URL => ' + url);

	proxiedRequest.get(url, function (error, response, body) {
	 /* if(error) {
	  	console.error(error);
	  	res.json(error);
	  }*/
	  //if (response.statusCode == 200) {
	  	console.info('Response OK');
	    body = JSON.parse(body);
	    var details = [];
	    var leadtime = 0;
	    var card;
	    var cardleadtime = 0;
	    //console.log('length = ' + body.length);
	    for (var i = 0; i < body.length; i++) {
	    	card = body[i];
	    	if(card.actions.length !== 0) {
  	    	cardleadtime = trelloUtils.calculateLeadTime(card, idLastList, idFirstList);
  	    	if(+cardleadtime > 0) {
	  	    	leadtime = math.add(+leadtime, +cardleadtime);
	  	    	details.push({ 'id': card.id, 'name': card.name, 'leadTime': cardleadtime });
  	    	}
  	    }
	    }

	    //console.log('total = '+ leadtime);
	    leadtime = math.format(math.divide(+leadtime, +details.length), 4);
	    	    
	    var result = { 'idFirstList': idFirstList, 'idLastList': idLastList, 'leadTime': leadtime, 'leadTimeUnit': trelloUtils.leadTimeUnit, 'details': details};

	    res.json(result);
	 // }
	});
	
});

module.exports = router;