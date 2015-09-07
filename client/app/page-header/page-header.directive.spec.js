'use strict';

describe('Directive: pageHeader', function () {

  // load the directive's module and view
  beforeEach(module('votingAppApp'));
  beforeEach(module('app/page-header/page-header.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<page-header></page-header>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pageHeader directive');
  }));
});