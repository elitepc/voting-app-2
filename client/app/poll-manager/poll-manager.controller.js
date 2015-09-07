'use strict';

angular.module('votingAppApp')
  .controller('PollManagerCtrl', function ($scope, $http, Auth, socket) {
    $scope.message = 'Hello';
    $scope.getCurrentUser = Auth.getCurrentUser;

    $http.get('/api/polls/mypolls').success(function(awesomeThings) {
      $scope.myPolls = awesomeThings;
      socket.syncUpdates('poll', $scope.myPolls);
    });

    $scope.addPoll = function() {
      if($scope.newPollName === '') {
        return;
      }
      $http.post('/api/polls', { name: $scope.newPollName });
      $scope.newThing = '';
    };
  });
