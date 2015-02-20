(function() {
  var ResourcesConfig, ResourcesCtrl;

  ResourcesCtrl = function($scope, $location, $http) {
    return $scope.resources = [];
  };

  ResourcesCtrl.$inject = ['$scope', '$location', '$http'];

  ResourcesConfig = function($routeProvider) {
    return $routeProvider.when('/resources', {
      templateUrl: 'app/resources/resources.html',
      controller: 'ResourcesCtrl'
    });
  };

  ResourcesConfig.$inject = ['$routeProvider'];

  angular.module('ngElement').config(ResourcesConfig).controller('ResourcesCtrl', ResourcesCtrl);

}).call(this);
