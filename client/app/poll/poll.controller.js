'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket, $routeParams, $location) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPoll = [{}];
    $scope.url = $location.absUrl();
    $scope.pollLabels = [];
    $scope.pollData = [];

    var pollUser = $routeParams.user;
    var pollUrl = $routeParams.pollName;
    console.log($routeParams);
    //TODO do not repeat yourself
    $scope.$watch('myPoll', function(){
      $scope.pollLabels = [];
      $scope.pollData = [];
      for(var index in $scope.myPoll[0].answers){
        if ($scope.myPoll[0].answers.hasOwnProperty(index)) {
          $scope.pollLabels.push(index);
          $scope.pollData.push($scope.myPoll[0].answers[index]);
        }
      }
    }, true);
    $http.get('/api/polls/' + pollUser + '/' + pollUrl).success(function(awesomeThings) {
      $scope.myPoll[0] = awesomeThings;
      socket.syncUpdates('poll', $scope.myPoll);

      for(var index in $scope.myPoll[0].answers){
        if ($scope.myPoll[0].answers.hasOwnProperty(index)) {
          $scope.pollLabels.push(index);
          $scope.pollData.push($scope.myPoll[0].answers[index]);
        }
      }
      console.log($scope.pollLabels, $scope.pollData);


      console.log($scope.myPoll[0]);
    });

    $scope.voteFor = function(answer){
      $http.put('/api/polls/' + $scope.myPoll[0].user_name + '/' + $scope.myPoll[0].url + '/' + answer)
      .then(function(response){
        console.log(response.data);
        //TODO
      });
    };
  });
