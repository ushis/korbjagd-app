'use strict';

angular
  .module('korbjagdApp')
  .directive('latLng', function() {
    return {
      restrict: 'E',
      scope: {
        loc: '=location'
      },
      template: '<div class="lat-lng" ng-bind="latlng"></div>',
      link: function(scope) {
        scope.latlng = [scope.loc.latitude, scope.loc.longitude].map(function(dec) {
          return parseFloat(dec).toFixed(5);
        }).join(', ');
      }
    };
  });
