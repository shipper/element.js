(function() {
  var ResourceConfig, ResourceCtrl;

  ResourceCtrl = function($scope, $location, $http) {
    var find;
    $scope.results = [];
    find = function() {
      return $http.get('/api/type').success(function(data) {
        return $scope.results = data;
      });
    };
    find();
    $scope["new"] = function() {
      return $location.path("/type");
    };
    return $scope.goto = function(type) {
      return $location.path("/type/" + type.key + "/elements");
    };
  };

  ResourceCtrl.$inject = ['$scope', '$location', '$http'];

  ResourceConfig = function($routeProvider) {
    return $routeProvider.when('/resource/:key?', {
      templateUrl: 'app/resource/resource.html',
      controller: 'ResourceCtrl'
    });
  };

  ResourceConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(ResourceConfig).controller('ResourceCtrl', ResourceCtrl);

}).call(this);
