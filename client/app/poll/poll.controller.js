'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;


  });
