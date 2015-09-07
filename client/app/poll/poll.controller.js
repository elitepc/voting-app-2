'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket, $routeParams, $location) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPoll = {};
    $scope.url = $location.absUrl();


    var pollUser = $routeParams.user;
    var pollUrl = $routeParams.pollName;
    console.log($routeParams);

    $http.get('/api/polls/' + pollUser + '/' + pollUrl).success(function(awesomeThings) {
      $scope.myPoll = awesomeThings[0];
      socket.syncUpdates('thisPoll', $scope.myPoll);
      console.log($scope.myPoll);
    });

  });
