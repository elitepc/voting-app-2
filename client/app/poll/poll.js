'use strict';

angular.module('votingAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/poll', {
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
