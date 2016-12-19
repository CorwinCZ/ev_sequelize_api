let models  = require('../models');
let express = require('express');
let router = express.Router();
let Sequelize = require('sequelize');

router.get('/show', function(req, res, next) {
	// Lists all persons in DB
	models.Pet.findAll({
		raw: true,
	}).then(function(dbData) {
		console.log('data jsou', dbData)
		res.render('pet/show', {'data': dbData})
	});
});

module.exports = router;