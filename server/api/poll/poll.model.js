'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: { type : String, unique : true, required : true },
  url: { type : String, required : true, lowercase: true },
  answers: { type : Object, required : true },
  user_id: { type : String, required : true },
  user_name_url: { type : String, required : true, lowercase: true, trim: true },
  info: String,
  active: Boolean
});



/**
 * Validations
 */

// Validate empty name
PollSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Poll name cannot be blank');

// Validate empty url
PollSchema
  .path('url')
  .validate(function(url) {
    return url.length;
  }, 'Poll url cannot be blank');

// Validate empty user_id
PollSchema
  .path('user_id')
  .validate(function(user_id) {
    return user_id.length;
  }, 'User id cannot be blank');

// Validate empty user_name
PollSchema
  .path('user_name_url')
  .validate(function(user_id) {
    return user_id.length;
  }, 'User name cannot be blank');


module.exports = mongoose.model('Poll', PollSchema);
