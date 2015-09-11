'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

//router.get('/', controller.index); //todo
router.get('/mypolls', auth.isAuthenticated(), controller.showMyPolls);
router.get('/:user/:pollUrl', controller.show);
router.get('/getip', controller.getIp);

router.post('/', auth.isAuthenticated(), controller.create);
router.post('/newAnswer', auth.isAuthenticated(), controller.newAnswer);

router.put('/:user/:pollUrl/:answer', controller.voteAnswer);

router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
