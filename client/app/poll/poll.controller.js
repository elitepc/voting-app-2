'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket, $routeParams, $location) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPoll = {};
    $scope.url = $location.absUrl();
    $scope.pollLabels = [];
    $scope.pollData = [];

    var pollUser = $routeParams.user;
    var pollUrl = $routeParams.pollName;
    console.log($routeParams);

    $http.get('/api/polls/' + pollUser + '/' + pollUrl).success(function(awesomeThings) {
      $scope.myPoll = awesomeThings;
      $scope.test = [];
      socket.syncUpdates('poll[0]', $scope.test);


      console.log($scope.myPoll.answers);
      for(var index in $scope.myPoll.answers){
        if ($scope.myPoll.answers.hasOwnProperty(index)) {
          $scope.pollLabels.push(index);
          $scope.pollData.push($scope.myPoll.answers[index]);
        }
      }
      console.log($scope.pollLabels, $scope.pollData);


      console.log($scope.myPoll);
    });

    $scope.voteFor = function(answer){
      $http.put('/api/polls/' + $scope.myPoll.user_name + '/' + $scope.myPoll.url + '/' + answer)
      .then(function(response){
        console.log(response.data);
        //TODO
      });
    };
  });
