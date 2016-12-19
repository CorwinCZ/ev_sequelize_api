var {User, Task}  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/query_test', function(req, res, next) {
	User.findAll({
		// include: [ Task ]
		raw:true
	}).then(function(users) {

		console.log('Návrat je', users)


		res.render('placeholder', {
			title: 'Sequelize: Express Example',
			msg: JSON.stringify(users),
		});
	});
});

router.get('/test_insert', function(req, res, next) {
	let msg = 'DOKY';

	User.build({
		username: 'Pokusný králík'
	})
	.save()
	.then(function(poky) {
		res.render('placeholder', {msg: poky});
	});





	// res.render('placeholder', {msg: msg});
});

module.exports = router;
