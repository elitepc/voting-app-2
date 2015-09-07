'use strict';

describe('Directive: pageFooter', function () {

  // load the directive's module and view
  beforeEach(module('votingAppApp'));
  beforeEach(module('app/page-footer/page-footer.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<page-footer></page-footer>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the pageFooter directive');
  }));
});