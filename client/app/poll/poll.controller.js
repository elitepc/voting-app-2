'use strict';

angular.module('votingAppApp')
  .controller('PollCtrl', function ($scope, $http, Auth, socket, $routeParams, $location, $window) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPoll = [{}];
    $scope.url = $location.absUrl();
    $scope.pollLabels = [];
    $scope.pollData = [];
    $scope.canVote = false;
    $scope.voteSum = 0;

    var pollUser = $routeParams.user;
    var pollUrl = $routeParams.pollName;

    var transformAnswerDataToChartData = function(){
      //transforms vote data to 2 objects required by chart.js

      $scope.pollLabels = [];
      $scope.pollData = [];
      for(var index in $scope.myPoll[0].answers){
        if ($scope.myPoll[0].answers.hasOwnProperty(index)) {
          $scope.pollLabels.push(index);
          $scope.pollData.push($scope.myPoll[0].answers[index]);
        }
      }
      //updates the vote sum
      $scope.voteSum = 0;
      for(var i = 0; i < $scope.pollData.length; i++){
        $scope.voteSum += $scope.pollData[i];
      }

    }

    $scope.$watch('myPoll', function(){
      //watches poll because of socket use

      //updates the chart
      transformAnswerDataToChartData();

    }, true);
    $http.get('/api/polls/' + pollUser + '/' + pollUrl).then(function(response) {
      //checks if user can vote (if IP is not on the list)
      $scope.canVote = response.data.canVote;


      $scope.myPoll[0] = response.data.poll;

      //sets the socket for updated poll in real time
      socket.syncUpdates('poll', $scope.myPoll);

      //updates the chart
      transformAnswerDataToChartData();

    }, function(response) {
      $window.location.href = '/';
    });

    $scope.voteFor = function(answer){
      $http.put('/api/polls/' + $scope.myPoll[0].user_name_url + '/' + $scope.myPoll[0].url + '/' + answer)
      .then(function(response){
        //already voted, then can't vote anymore
        $scope.canVote = false;
        //adds one the sum of votes
        $scope.voteSum++;

        //updated poll
        $scope.myPoll[0] = response.data;
        transformAnswerDataToChartData();
      });
    };

    $scope.addAnswerToPoll = function() {
      if($scope.newAnswer === '') {
        return;
      }
      $http.post('/api/polls/newAnswer', { id: $scope.myPoll[0]._id, newAnswer: $scope.newAnswer })
      .then(function(response){
        $scope.myPoll[0] = response.data;
        $scope.mainErrorMessage = "";
        $scope.myForm.$setPristine();
        //already voted, then can't vote anymore
        $scope.canVote = false;
        //adds one the sum of votes
        $scope.voteSum++;
      },
      function(err){
        var form = $scope.myForm;
        err = err.data;
        $scope.mainErrorMessage = err;



        return false;
      });
    };


  });
