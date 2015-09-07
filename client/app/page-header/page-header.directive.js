'use strict';

angular.module('votingAppApp')
  .directive('pageHeader', function () {
    return {
      templateUrl: 'app/page-header/page-header.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
