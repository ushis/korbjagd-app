'use strict';

angular
  .module('korbjagdApp')
  .controller('MapCtrl', function($scope, $state, $timeout, $document, $window,
                                  _, geolocation, google, BasketRepo) {

    // Goes to a basket
    $scope.showBasket = function(basket) {
      $state.go('map.app.basket.details', {basketId: basket.id});
    };

    $scope.applyBaskets = function(baskets) {
      if (!baskets) {
        baskets = BasketRepo.getAll();
      }

      baskets.forEach(function(basket) {
        if (!basket.show) {
          basket.show = function() { $scope.showBasket(basket); };
        }
      });

      $scope.map.baskets = baskets;
    };

    // Set a basket in the repo
    $scope.setBasket = function(basket) {
      BasketRepo.set(basket);
      $scope.applyBaskets();
    };

    // Removes a basket from the repo
    $scope.rmBasket = function(basket) {
      BasketRepo.rm(basket);
      $scope.applyBaskets();
    };

    // Loads additional baskets
    var loadBaskets = function() {
      var b = $scope.map.instance.getBounds();

      BasketRepo.get(b.getSouthWest(), b.getNorthEast(), function(baskets) {
        $scope.applyBaskets(baskets);
      });
    };

    // Initializes the map
    var initMap = function(map) {
      if ($scope.map.instance !== null) {
       return;
      }
      $scope.map.instance = map;

      // Make map draggable
      map.draggable = true;

      // Load additional baskets on bounds change
      map.addListener('bounds_changed', _.debounce(loadBaskets, 600));

      // Open basket form on double click
      map.addListener('dblclick', function(e) {
        $state.go('map.app.basket-new', {
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng()
        });
      });

      // Init search box and load initial baskets
      initSearchBox();
      loadBaskets();
    };

    // Initializes the search box
    var initSearchBox = function() {
      var input = $document[0].getElementById('search-places');
      var searchBox = new google.maps.places.SearchBox(input);

      google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place) {
          bounds.extend(place.geometry.location);
        });

        var map = $scope.map.instance;
        map.fitBounds(bounds);

        if (map.getZoom() > 16) {
          map.setZoom(16);
        }
        $state.go('map.app.home');
      });
    };

    // Set sane map defaults
    $scope.map = {
      instance: null,
      center: {latitude: 51.34, longitude: 12.37},
      zoom: 12,
      baskets: [],
      options: {
        minZoom: 5,
        disableDoubleClickZoom: true,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        },
        mapTypeControl: true,
        streetViewControl: true
      },
      events: {
        tilesloaded: initMap
      },
      markers: {
        clusterOptions: {
          imagePath: '/images/clusters/m'
        }
      },
      geolocation: true
    };

    // Try to get the users location
    geolocation.getLocation().then(function(loc) {
      if ($scope.map.geolocation) {
        $scope.map.center = angular.copy(loc.coords);
      }
    });

    // Full screen map
    var resizeMap = function() {
      var canvas = $document[0].querySelector('.angular-google-map-container');
      canvas.style.height = $window.innerHeight + 'px';
    };

    $window.addEventListener('resize', _.debounce(resizeMap, 200));
    resizeMap();
  });
