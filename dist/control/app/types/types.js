(function() {
  var TypesConfig, TypesCtrl;

  TypesCtrl = function($scope, $http, $location) {
    var find;
    $scope.results = [];
    find = function() {
      return $http.get('/api/type').success(function(data) {
        return $scope.results = data;
      });
    };
    find();
    return $scope.goto = function(type) {
      return $location.path("/type/" + type.key);
    };
  };

  TypesCtrl.$inject = ['$scope', '$http', '$location'];

  TypesConfig = function($routeProvider) {
    return $routeProvider.when('/types', {
      templateUrl: 'app/types/types.html',
      controller: 'TypesCtrl'
    });
  };

  TypesConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(TypesConfig).controller('TypesCtrl', TypesCtrl);

}).call(this);
