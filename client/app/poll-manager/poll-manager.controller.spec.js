'use strict';

describe('Controller: PollManagerCtrl', function () {

  // load the controller's module
  beforeEach(module('votingAppApp'));

  var PollManagerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PollManagerCtrl = $controller('PollManagerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
