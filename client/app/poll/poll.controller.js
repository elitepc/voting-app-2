'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket, $routeParams, $location, $window) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPoll = [{}];
    $scope.url = $location.absUrl();
    $scope.pollLabels = [];
    $scope.pollData = [];
    $scope.myIp = "";

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
    $http.get('/api/polls/getip').then(function(response) {
      $scope.myIp = response.data.ip;
    });
    $http.get('/api/polls/' + pollUser + '/' + pollUrl).then(function(response) {
      $scope.myPoll[0] = response.data;
      socket.syncUpdates('poll', $scope.myPoll);

      for(var index in $scope.myPoll[0].answers){
        if ($scope.myPoll[0].answers.hasOwnProperty(index)) {
          $scope.pollLabels.push(index);
          $scope.pollData.push($scope.myPoll[0].answers[index]);
        }
      }
      console.log($scope.pollLabels, $scope.pollData);


      console.log($scope.myPoll[0]);
    }, function(response) {
      $window.location.href = '/';
    });

    $scope.voteFor = function(answer){
      $http.put('/api/polls/' + $scope.myPoll[0].user_name_url + '/' + $scope.myPoll[0].url + '/' + answer)
      .then(function(response){
        console.log(response.data);
        //TODO
      });
    };
  });
