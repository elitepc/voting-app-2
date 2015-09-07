'use strict';

angular.module('votingAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/poll-manager', {
        templateUrl: 'app/poll-manager/poll-manager.html',
        controller: 'PollManagerCtrl',
        authenticate: true // restrict to authenticated users
      });
  });
