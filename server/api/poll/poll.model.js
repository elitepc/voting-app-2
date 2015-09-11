'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: { type : String, required : true,
      validate: [
      { validator: nameValidator, msg: 'Poll\'s name must be unique for this account'}
      ]},
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

var pollModel = mongoose.model('Poll', PollSchema);


function nameValidator(value, done){

 if (value) {
   pollModel.count({ _id: {'$ne': this._id }, url: this.url, user_name_url: this.user_name_url }, function (err, count) {
     if (err) {
       return done(err);
     }
     // If `count` is greater than zero, "invalidate"
     done(!count);
   });
 }
}



// Validate empty name
PollSchema
  .path('name')
  .validate(function(name) {
    return name.length && nameValidator();
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





module.exports = pollModel;
