let models  = require('../models');
let express = require('express');
let router = express.Router();
let Sequelize = require('sequelize');

router.get('/test', function(req, res, next) {
	res.send({'test': 'testik'});
});

router.post('/person', function(req, res, next) {
	models.Person.findAll({
		raw: true,
		/*include: [{
			model: models.Pet,
			where: { personId: Sequelize.col('Person.id') }
		}]*/
	}).then(function(dbData) {
		// console.log('data jsou', dbData)
		res.send(dbData)
	});
});



router.post('/insert_person', function(req, res, next) {
	// inserts data to DB
	console.log('dostal jsem', req.body);
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

	res.send({'status': 'něco se stalo'})
});



module.exports = router;