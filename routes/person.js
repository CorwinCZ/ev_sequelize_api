let models  = require('../models');
let express = require('express');
let router = express.Router();
let Sequelize = require('sequelize');

router.get('/', function(req, res, next) {
	res.render('person/index', {'title': 'Poky person'})
});

router.get('/show', function(req, res, next) {
	// Lists all persons in DB
	models.Person.findAll({
		raw: true,
	}).then(function(dbData) {
		console.log('data jsou', dbData)
		res.render('person/show', {'data': dbData})
	});
});

router.get('/add', function(req, res, next) {
	// shows adding form 
	res.render('person/add', {})
});

router.post('/insert', function(req, res, next) {
	// inserts data to DB
	console.log('dostal jsem', req.body)
	models.Person
		.create(req.body)
		.then(function() {
			console.log('Vše proběhlo OK');
		})
		.catch(Sequelize.ValidationError, function(error) {
			console.log('první catch máme error', error.message);
		})
		.catch(function(error) {
			cosnole.log('Druhý error');
		});

	res.render('person/add', {})
	// res.json({"poky": "doky"})		// TODO - change this to send succes / fail object, not template

});

/*
TODO

Využít Sequelize migrace k přidání pár sloupců -- DONE
	* 
vytvořit novou tabulku co bude mít na person 1:N vazbu a otestovat sosání dat z ní (ukládání asi není potřeba)

React - přidat ho do stacku, urpavit start-up scripty a rozběhat.
	* Přehodit všechny view na react, express ať se chová jako pseudo-REST API

GraphQL - nahodit zde na hlavním serveru a postupně nad něj postavit celé API - React se bude ptát pouze GraphQL


*/

module.exports = router;
