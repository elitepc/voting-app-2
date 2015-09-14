/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Poll = require('../api/poll/poll.model');



User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    name_url: 'testuser',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    name_url: 'admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
      Poll.find({}).remove(function() {

        User.findOne({name:'Admin'}, function(err, user){
          Poll.create({
            name : 'Example Poll',
            url : 'examplepoll',
            answers : {Yes: 10, No: 0},
            user_id: user._id,
            user_name_url: 'admin'
          });
        });

      });
    }
  );
});
