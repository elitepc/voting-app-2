'use strict';

angular.module('votingAppApp')
  .controller('PollManagerCtrl', function ($scope, $http, Auth, socket) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.newPollAnswers = [{value:'Yes'}, {value:'No'}];
    $scope.mainErrorMessage = "";
    $scope.notUniqueAnswers = false;


    $http.get('/api/polls/mypolls').success(function(awesomeThings) {
      $scope.myPolls = awesomeThings;
      socket.syncUpdates('poll', $scope.myPolls);
    });

    var transformPollAnswersArr = function(){
      var arr = [];
      for(var i = 0; i < $scope.newPollAnswers.length; i++){
        arr.push($scope.newPollAnswers[i].value);
      }
      return arr;
    }

    $scope.addPollAnswer = function() {
      $scope.newPollAnswers.push({value: ''});
    };

    $scope.removePollAnswer = function() {
      if($scope.newPollAnswers.length > 2){
        $scope.newPollAnswers.pop();
      }

    };

    $scope.$watch('newPollAnswers', function() {
      //check if all answers are unique
      var sorted_arr = transformPollAnswersArr().slice().sort();
      for (var i = 0; i < sorted_arr.length - 1; i++) {
          if (sorted_arr[i + 1] == sorted_arr[i]) {
              $scope.notUniqueAnswers = true;
              $scope.myForm.$setValidity('uniqueAnswers', false);
              return true;
          }
      }
      $scope.notUniqueAnswers = false;
      $scope.myForm.$setValidity('uniqueAnswers', true);
      return false;

    }, true);

    $scope.addPoll = function() {
      if($scope.newPollName === '') {
        return;
      }
      $scope.submitted = true;

      $http.post('/api/polls', { name: $scope.newPollName, answers: transformPollAnswersArr() })
      .then(function(response){
        $scope.newPollName = "";
        $scope.newPollAnswers = [{value:'Yes'}, {value:'No'}];
        $scope.mainErrorMessage = "";
        $scope.notUniqueAnswers = false;
        $scope.myForm.$setPristine();
      },
      function(err){
        var form = $scope.myForm;
        err = err.data;
        if(err.errors.name){
          $scope.mainErrorMessage = err.errors.name.message;
        }
        else if(err.errors.url && err.errors.url.kind === 'required'){
          //in case name_url is empty
          $scope.mainErrorMessage = "Poll's name must have at least 1 alphanumeric character";
        }


        return false;
      });
    };
    $scope.deletePoll = function(id) {
      $http.delete('/api/polls/' + id)
      .then(function(response){
        for(var i = 0; i < $scope.myPolls.length; i++){
          if($scope.myPolls._id == id){
            $scope.myPolls.splice(i, 1);

          }
        }
      },
      function(err){

        return false;
      });
    };
  });
