(function() {
  var ElementsConfig, ElementsCtrl,
    __hasProp = {}.hasOwnProperty;

  ElementsCtrl = function($scope, $http, $location, $routeParams) {

    /*
    $http.get( '/api/type' )
    .success( ( data ) ->
    
      $scope.types = data
    
      _.each( data, ( type ) ->
    
        $http.get( "/api/type/#{ type.key }/element" )
        .success( ( elements ) ->
          type.elements = elements
        )
      )
    
    )
     */
    $scope["new"] = function() {
      return $scope.newElement($scope.type);
    };
    $scope["delete"] = function() {
      if (!confirm("Are you sure you wish to delete this type?")) {
        return;
      }
      return $http["delete"]("/api/type/" + $routeParams.type).success(function() {
        return $location.path('/home');
      });
    };
    $scope.edit = function() {
      return $scope.goto($scope.type);
    };
    $http.get("/api/type/" + $routeParams.type).success(function(data) {
      return $scope.type = data;
    }).error(function() {
      return $location.path('/home');
    });
    $http.get("/api/type/" + $routeParams.type + "/element").success(function(data) {
      return $scope.elements = data;
    });
    $scope.newElement = function(type) {
      return $location.path("/type/" + type.key + "/element");
    };
    $scope.remove = function(type) {};
    $scope.goto = function(type) {
      return $location.path("/type/" + type.key);
    };
    $scope.gotoElement = function(element) {
      return $location.path("/type/" + $scope.type.key + "/element/" + element.key);
    };
    $scope.shouldShow = function(type, element) {
      return $scope.getMain(type, element) != null;
    };
    $scope.getMainProperty = function() {
      var definition, key, type, val;
      type = $scope.type;
      if (type == null) {
        return;
      }
      definition = type.definition;
      for (key in definition) {
        if (!__hasProp.call(definition, key)) continue;
        val = definition[key];
        if (!val.main) {
          continue;
        }
        return key;
      }
      return 'Name';
    };
    return $scope.getMain = function(element) {
      var definition, key, main, not_empty, type, val, _ref, _ref1, _ref2, _ref3;
      type = $scope.type;
      if (type == null) {
        return;
      }
      definition = type.definition;
      main = null;
      not_empty = null;
      for (key in definition) {
        if (!__hasProp.call(definition, key)) continue;
        val = definition[key];
        if (!val.main) {
          if ((not_empty == null) && (((_ref = element.data) != null ? _ref[key] : void 0) != null)) {
            not_empty = key;
            if (main != null) {
              break;
            }
          }
          continue;
        }
        main = key;
        if (not_empty != null) {
          break;
        }
      }
      if ((main != null) && (((_ref1 = element.data) != null ? _ref1[main] : void 0) != null)) {
        return (_ref2 = element.data) != null ? _ref2[main] : void 0;
      }
      return (_ref3 = element.data) != null ? _ref3[not_empty] : void 0;
    };
  };

  ElementsCtrl.$inject = ['$scope', '$http', '$location', '$routeParams'];

  ElementsConfig = function($routeProvider) {
    return $routeProvider.when('/type/:type/elements', {
      templateUrl: 'app/elements/elements.html',
      controller: 'ElementsCtrl',
      data: {
        back: '/home'
      }
    });

    /*
    .when( '/elements/:type?', {
      templateUrl: 'app/elements/elements.html',
      controller: 'ElementsCtrl'
    })
     */
  };

  ElementsConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(ElementsConfig).controller('ElementsCtrl', ElementsCtrl);

}).call(this);
