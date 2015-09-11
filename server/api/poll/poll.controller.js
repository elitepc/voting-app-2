'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');
var User = require('../user/user.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.show = function(req, res) {

  var findObj = {user_name_url: req.params.user, url: req.params.pollUrl};
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
// Get client IP address
exports.getIp = function(req, res){
  var voter_ip = req.connection.remoteAddress;

  res.status(200).json({ip: voter_ip});

}
// Creates a new poll in the DB.
exports.create = function(req, res) {
  var userId = req.user._id;
  var userNameUrl = req.user.name_url;

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


  //sets poll url
  if(newPoll.name){
    newPoll.url = newPoll.name.replace(/\W+/g, '').toLowerCase();
  }
  //sets user name url
  newPoll.user_name_url = userNameUrl;

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

  var findObj = {user_name_url: req.params.user, url: req.params.pollUrl};
  var answer = req.params.answer;
  var voter_ip = req.connection.remoteAddress;

  Poll.findOne(findObj, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    if(poll.voters_ip.indexOf(voter_ip) >= 0){ return res.status(500).send('Voter already voted'); }
    if(!(answer in poll.answers)){
      return res.status(500).send('Answer is not valid');
    }
    //adds one to the voted answered
    poll.answers[answer]++;
    poll.markModified('answers.' + [answer]);
    //inserts voters ip
    poll.voters_ip.push(voter_ip);

    poll.save(function (err) {
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
