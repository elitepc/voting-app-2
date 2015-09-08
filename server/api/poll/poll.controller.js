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
  var findObj = {user_name: req.params.user, url: req.params.pollUrl};
  Poll.findOne(findObj, function (err, poll) {
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
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  var userName = req.user.name;

  //checks if answers are unique
  var sorted_arr = req.body.answers.slice().sort();
  for (var i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      return res.status(500).send('Answers are not unique');
    }
  }
  //sets new answers Array
  if(req.body.answers){
    var answers = req.body.answers.slice();

    var answersObj = {};
    for(var i = 0; i < answers.length; i++){
      answersObj[answers[i]] = 0;
    }

    req.body.answers = answersObj;
  }

  var newPoll = req.body;
  newPoll.user_id = userId;
  newPoll.user_name = userName;

  //sets poll url
  if(newPoll.name){
    newPoll.url = newPoll.name.replace(/\W+/g, '').toLowerCase();
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
    var updated = _.extend(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Updates an existing poll in the DB with new vote.
exports.voteAnswer = function(req, res) {
  //TODO check if user already voted, check if vote is valid

  var findObj = {user_name: req.params.user, url: req.params.pollUrl};
  var answer = req.params.answer;


  Poll.find(findObj, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
/*
    var answers = { answers: []};
    answers.answers[0] = poll.answers[0];
    //add one to existing result
    answers.answers[0][answer] = Number(answers.answers[0][answer]) + 1;
    var updated = _.extend(poll, answers);
*/
console.log(JSON.stringify(poll, null, 2));
    poll[0].answers[answer]++;

    poll[0].save(function (err) {
      if (err) { return handleError(res, err); }
      //just for debugging
      Poll.findById(poll[0]._id, function(err, shouldBeEqualTopollButWTFisGoingOn){
        console.log(poll[0]);
        console.log(shouldBeEqualTopollButWTFisGoingOn);
      });
      return res.status(200).json(poll[0]);
    });
  });


};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var userId = req.user._id;
    if(userId != poll.user_id){
      return res.status(500).send('You do not have permission to execute that command');
    }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
