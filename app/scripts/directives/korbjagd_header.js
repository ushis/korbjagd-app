'use strict';

angular
  .module('korbjagdApp')
  .directive('korbjagdHeader', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/shared/header.html'
    };
  });
