'use strict';

var express = require('express');
var controller = require('./poll.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index); //todo
router.get('/mypolls', auth.isAuthenticated(), controller.showMyPolls);
router.get('/:user/:pollName', controller.show); //todo
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update); //todo
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
