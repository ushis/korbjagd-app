'use strict';

angular
  .module('korbjagdApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ui.utils',
    'google-maps',
    'geolocation',
    'config',
    'angularMoment'
  ])
  .constant('_', window._)
  .constant('google', window.google)
  .config(function($httpProvider, $urlRouterProvider, $stateProvider) {
    $httpProvider.interceptors.push('Interceptor');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .state('map.app', {
        templateUrl: 'views/app.html',
        controller: 'AppCtrl'
      })
      .state('map.app.home', {
        url: '/'
      })
      .state('map.app.sign', {
        templateUrl: 'views/user/sign.html'
      })
      .state('map.app.sign.in', {
        url: '/signin',
        templateUrl: 'views/user/signin.html',
        controller: 'SigninCtrl'
      })
      .state('map.app.sign.up', {
        url: '/signup',
        templateUrl: 'views/user/signup.html',
        controller: 'SignupCtrl'
      })
      .state('map.app.profile', {
        url: '/profile',
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('map.app.profile-delete', {
        url: '/profile/delete',
        templateUrl: 'views/user/delete.html',
        controller: 'UserDeleteCtrl'
      })
      .state('map.app.password', {
        abstract: true,
        url: '/password',
        templateUrl: 'views/password/index.html',
        controller: 'PasswordCtrl'
      })
      .state('map.app.password.forgot', {
        url: '/forgot',
        templateUrl: 'views/password/forgot.html',
        controller: 'PasswordForgotCtrl'
      })
      .state('map.app.password.instructions', {
        url: '/instructions',
        templateUrl: 'views/password/instructions.html',
        controller: 'PasswordInstructionsCtrl'
      })
      .state('map.app.password.reset', {
        url: '/reset/:token',
        templateUrl: 'views/password/reset.html',
        controller: 'PasswordResetCtrl'
      })
      .state('map.app.basket-new', {
        url: '/baskets/new/:latitude/:longitude',
        templateUrl: 'views/basket/new.html',
        controller: 'BasketNewCtrl',
        resolve: {
          categories: ['Category', function(Category) {
            return Category.query().$promise;
          }],
          nearbyBaskets: ['$stateParams', 'Basket', function($stateParams, Basket) {
            var r = 0.00045; // ~ 50 meters
            var lat = parseFloat($stateParams.latitude);
            var lng = parseFloat($stateParams.longitude);

            var bounds = [
              [lat - r, lng - r].join(','),
              [lat + r, lng + r].join(',')
            ];

            return Basket.query({'inside[]': bounds}).$promise;
          }]
        }
      })
      .state('map.app.basket', {
        abstract: true,
        url: '/baskets/:basketId',
        template: '<div ui-view></div>',
        controller: 'BasketCtrl',
        resolve: {
          basket: ['$stateParams', 'Basket', function($stateParams, Basket) {
            return Basket.get($stateParams).$promise;
          }]
        }
      })
      .state('map.app.basket.details', {
        url: '/details',
        templateUrl: 'views/basket/details.html'
      })
      .state('map.app.basket.edit', {
        url: '/edit',
        templateUrl: 'views/basket/edit.html',
        controller: 'BasketEditCtrl',
        resolve: {
          categories: ['Category', function(Category) {
            return Category.query().$promise;
          }]
        }
      })
      .state('map.app.basket.delete', {
        url: '/delete',
        templateUrl: 'views/basket/delete.html',
        controller: 'BasketDeleteCtrl'
      })
      .state('map.app.basket.comments', {
        url: '/comments',
        templateUrl: 'views/comment/index.html',
        controller: 'CommentsCtrl',
        resolve: {
          comments: ['$stateParams', 'Comment', function($stateParams, Comment) {
            return Comment.query($stateParams).$promise;
          }]
        }
      })
      .state('map.app.basket.comment', {
        url: '/comments/:commentId',
        template: '<div ui-view></div>',
        resolve: {
          comment: ['$stateParams', 'Comment', function($stateParams, Comment) {
            return Comment.get($stateParams).$promise;
          }]
        }
      })
      .state('map.app.basket.comment.delete', {
        url: '/delete',
        templateUrl: 'views/comment/delete.html',
        controller: 'CommentDeleteCtrl'
      });
  });
