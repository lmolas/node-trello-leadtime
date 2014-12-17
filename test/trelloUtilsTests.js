'use strict';

var request = require('request');

var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
var should = require('should');
var sinon = require('sinon');

var trelloUtils = require('../src/trelloUtils.js');

describe("trelloUtils tests", function() {
   
   describe("constructUrl tests", function() {
       
       it("should add key and token to input url without optional parameters", function(){
           // Arrange
           var inputUrl = 'http://www.test.com';
           
           // Act 
           var resultUrl = trelloUtils.constructUrl(inputUrl);
           
           // Assert
           resultUrl.should.equal(inputUrl + '?key=' + trelloUtils.TRELLO_KEY + '&token=' + trelloUtils.TRELLO_TOKEN);
       });
       
       it("should add key and token to input url with optional parameters", function(){
           // Arrange
           var inputUrl = 'http://www.test.com?test=ok';
           
           // Act 
           var resultUrl = trelloUtils.constructUrl(inputUrl);
           
           // Assert
           resultUrl.should.equal(inputUrl + '&key=' + trelloUtils.TRELLO_KEY + '&token=' + trelloUtils.TRELLO_TOKEN);
       });
       
   });
   
   
   describe("getdateEntryInFirstList tests", function() {
       
       it("should return creation date of card when no move into first list", function(){
           // Arrange
           var card = { 'id': 3, 'actions': [{ 'id': 42, 'date':'2014-11-06T15:43:44.050Z', 'type': 'createCard' }] };
           
           // Act 
           var date = trelloUtils.getdateEntryInFirstList(card, 121);
           
           // Assert
           date.should.equal('2014-11-06T15:43:44.050Z');
       });
       
       it("should return date of entry in first list", function(){
           // Arrange
           var card = { 'id': 3, 'actions': [{ 'id': 43, 'date':'2014-11-12T15:43:44.050Z', 'type': 'updateCard', 'data': { 'listAfter': { 'id': 121 } } }, { 'id': 42, 'date':'2014-11-06T15:43:44.050Z', 'type': 'createCard' }] };
           
           // Act 
           var date = trelloUtils.getdateEntryInFirstList(card, 121);
           
           // Assert
           date.should.equal('2014-11-12T15:43:44.050Z');
       });
       
       it("should return creation date of card when card has been created in first list", function(){
           // Arrange
           var card = { 'id': 3, 'actions': [{ 'id': 43, 'date':'2014-11-12T15:43:44.050Z', 'type': 'updateCard', 'data': { 'listBefore': { 'id': 121 } } }, { 'id': 42, 'date':'2014-11-06T15:43:44.050Z', 'type': 'createCard' }] };
           
           // Act 
           var date = trelloUtils.getdateEntryInFirstList(card, 121);
           
           // Assert
           date.should.equal('2014-11-06T15:43:44.050Z');
       });

   });
   
   describe("getdateEntryInLastList tests", function() {
       
       it("should return most recent date of entry in last list", function(){
           // Arrange
           var card = { 'id': 3, 'actions': [{ 'id': 44, 'date':'2014-11-14T12:15:44.050Z', 'type': 'updateCard', 'data': { 'listAfter': { 'id': 122 } } }, { 'id': 43, 'date':'2014-11-12T15:43:44.050Z', 'type': 'updateCard', 'data': { 'listAfter': { 'id': 122 } } }, { 'id': 42, 'date':'2014-11-06T15:43:44.050Z', 'type': 'createCard' }] };
           
           // Act 
           var date = trelloUtils.getdateEntryInLastList(card, 122);
           
           // Assert
           date.should.equal('2014-11-14T12:15:44.050Z');
       });
       
       
   });
   
   describe("calculateLeadTime tests", function() {
       
       it("should calculate lead time for a card from first list to last list", function(){
           // Arrange
           var card = { 'id': 3, 'actions': [{ 'id': 44, 'date':'2014-11-14T15:43:44.050Z', 'type': 'updateCard', 'data': { 'listAfter': { 'id': 122 } } }, { 'id': 43, 'date':'2014-11-12T15:43:44.050Z', 'type': 'updateCard', 'data': { 'listAfter': { 'id': 121 } } }, { 'id': 42, 'date':'2014-11-06T15:43:44.050Z', 'type': 'createCard' }] };
           
           // Act 
           var leadtime = trelloUtils.calculateLeadTime(card, 122, 121);
           
           // Assert
           leadtime.should.equal('2');
       });
       
       
   });
   
   
   describe("proxiedRequestGet tests", function() {
      
        describe("proxiedRequestGet nominal test", function() {
       
            // before(function(done){
            //   var requestResponse = {};
            //   requestResponse.statusCode = 200;
            //     sinon.stub(request, 'get')
            //         .yields(null, requestResponse, JSON.stringify({test: 'ok'}));
            //         done();
            // });
            
            // after(function(done){
            //     request.get.restore();
            //     done();
            // });
           
            it("should perform get request and return json body", function(){
              
              // Arrange
              var requestResponse = {};
              requestResponse.statusCode = 200;
                sinon.stub(request, 'get')
                    .yields(null, requestResponse, JSON.stringify({test: 'ok'}));
              
              var response = {};
              response.json = sinon.spy();
               
              // Act 
              trelloUtils.proxiedRequestGet('http://www.trello.com', response, null);
               
              // Assert
              sinon.assert.calledWithMatch(response.json, JSON.stringify({test: 'ok'}));
              response.statusCode.should.equal(200);
              
              request.get.restore();
            });
               
        });
        
        describe("proxiedRequestGet error test", function() {
       
            // before(function(done){
            //   var requestResponse = {};
            //   requestResponse.statusCode = 500;
            //   var requestError = 'error';
            //     sinon.stub(request, 'get')
            //         .yields(requestError, requestResponse, JSON.stringify({test: 'nok'}));
            //     done();
            // });
            
            // after(function(done){
            //     request.get.restore();
            //     done();
            // });
           
            it("should perform get request and handle error", function(){
              
              // Arrange
              var requestResponse = {};
              requestResponse.statusCode = 500;
              var requestError = 'error';
                sinon.stub(request, 'get')
                    .yields(requestError, requestResponse, JSON.stringify({test: 'nok'}));
                    
              var response = {};
              var resultError;
              var next = function(error) { resultError = error; };
              
              // Act 
              trelloUtils.proxiedRequestGet('http://www.trello.com', response, next);
               
              // Assert
              resultError.status.should.equal(500);
              resultError.errorMessage.should.equal('error');
              response.statusCode.should.equal(500);
              
              request.get.restore();
              
            });
               
        });
        
    });
        
        
});
        
   
