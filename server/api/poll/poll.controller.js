'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    return res.json(poll);
  });
};

// Get all my polls
exports.showMyPolls = function(req, res) {
  var userId = req.user._id;

  var findObj = {user_id: userId};

  Poll.find(findObj, function (err, polls) {
    if(err) { return handleError(res, err); }
    if(!polls) { return res.status(200).send('Not Found'); }
    return res.json(polls);
  });
  /*Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    return res.json(poll);
  });
  */
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  var newPoll = req.body;
  newPoll.user_id = userId;

  //sets poll url
  if(newPoll.name){
    newPoll.url = newPoll.name.replace(/\W+/g, '').toLowerCase();
  }
  //sets new answers Array
  if(req.body.answers){
    var answers = req.body.answers.slice();

    var answersObj = {};
    for(var i = 0; i < answers.length; i++){
      answersObj[answers[i]] = 0;
    }

    req.body.answers = [answersObj];
  }

  Poll.create(newPoll, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.merge(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
