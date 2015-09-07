'use strict';

angular.module('votingAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/poll/:user/:pollName', {
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
