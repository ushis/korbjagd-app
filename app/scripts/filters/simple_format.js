'use strict';

angular
  .module('korbjagdApp')
  .filter('simpleFormat', function($filter) {
    return function(txt) {
      return $filter('linky')(txt || '').replace(/\&#10;/g,'<br>');
    };
  });
