(function() {
  var ElementConfig, ElementCtrl;

  ElementCtrl = function($scope, $http, $routeParams) {
    $scope.key = $routeParams.key;
    $scope.save = function() {
      var element, method, query;
      element = $scope.element;
      method = 'post';
      query = '/api/element';
      if ($scope.key != null) {
        method = 'put';
        query += "/" + $scope.key;
      }
      return $http[method](query, element).success(function(data, status, headers) {
        var location, regex;
        if (method !== 'post') {
          return;
        }
        location = headers().location;
        regex = /\/?api\/element\/(.+)\/?/g;
        return $scope.key = regex.exec(location)[1];
      });
    };
    $scope.select = function() {};
    return $http.get("/api/type/" + $routeParams.type + "/definition").success(function(definition) {
      $scope.definition = definition;
      if ($routeParams.key) {
        return $http.get("/api/element/" + $routeParams.key).then(function(element) {
          return $scope.element = element;
        });
      } else {
        return $scope.element = {};
      }
    });
  };

  ElementCtrl.$inject = ['$scope', '$http', '$routeParams'];

  ElementConfig = function($routeProvider) {
    return $routeProvider.when('/type/:type/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl'
    });
  };

  ElementConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(ElementConfig).controller('ElementCtrl', ElementCtrl);

}).call(this);
