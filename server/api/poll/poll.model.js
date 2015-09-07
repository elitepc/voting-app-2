'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  user_id: String
});

module.exports = mongoose.model('Poll', PollSchema);
