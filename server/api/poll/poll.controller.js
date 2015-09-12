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
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var findObj = {user_name_url: req.params.user, url: req.params.pollUrl};
  Poll.findOne(findObj, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    //checks if voter already voted (IP)
    var canVote;
    if(poll.voters_ip.indexOf(ip) >= 0){
      canVote = false;
    }
    else{
      canVote = true;
    }

    //deletes IP info before sending to the client
    poll.voters_ip = "";
    //deletes user_id before sending to the client
    poll.user_id = "";

    return res.json({poll: poll, canVote: canVote});
  });


};

// Get all my polls
exports.showMyPolls = function(req, res) {
  var userId = req.user._id;

  var findObj = {user_id: userId};

  Poll.find(findObj, function (err, polls) {
    if(err) { return handleError(res, err); }
    if(!polls) { return res.status(200).send('Not Found'); }

    //deletes voters ip and user id from the polls
    polls.map(function(poll){
      poll.voters_ip = "";
      poll.user_id = "";
    });

    return res.json(polls);
  });
};

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

// Updates an existing poll in the DB with new vote.
exports.newAnswer = function(req, res) {


  var answer = req.body.newAnswer;
  var voter_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  Poll.findById(req.body.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    if(poll.voters_ip.indexOf(voter_ip) >= 0){ return res.status(500).send('Voter already voted'); }
    if(answer in poll.answers){
      return res.status(500).send("Poll already has this answer");
    }
    //adds one to the voted answered
    poll.answers[answer] = 1;
    poll.markModified('answers');
    //inserts voters ip
    poll.voters_ip.push(voter_ip);

    poll.save(function (err) {
      if (err) { return handleError(res, err); }

      return res.status(200).json(poll);
    });
  });


};

// Updates an existing poll in the DB with new vote.
exports.voteAnswer = function(req, res) {

  var findObj = {user_name_url: req.params.user, url: req.params.pollUrl};
  var answer = req.params.answer;
  var voter_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

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
