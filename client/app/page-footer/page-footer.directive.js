'use strict';

angular.module('votingAppApp')
  .directive('pageFooter', function () {
    return {
      templateUrl: 'app/page-footer/page-footer.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
