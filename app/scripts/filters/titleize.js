'use strict';

angular
  .module('korbjagdApp')
  .filter('titleize', function() {
    return function(txt) {
      return (txt || '')
        .replace('_', ' ')
        .replace(/(?:^|\s|-)\S/g, function(c) {
          return c.toUpperCase();
        });
    };
  });
