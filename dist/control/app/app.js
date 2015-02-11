(function() {
  var AppConfig, AppCtrl;

  AppCtrl = function($scope, Session, $location) {
    $scope.Session = Session;
    $scope.$on('back-path', function(event, path) {
      return $scope.back = path;
    });
    $scope.$on('$routeChangeSuccess', function(event, next) {
      if ((next != null ? next.data : void 0) == null) {
        $scope.title = void 0;
        $scope.back = void 0;
        return;
      }
      $scope.title = next.data.title;
      return $scope.back = next.data.back;
    });
    return $scope.goBack = function() {
      if ($scope.back == null) {
        return;
      }
      return $location.path($scope.back);
    };
  };

  AppCtrl.$inject = ['$scope', 'Session', '$location'];

  AppConfig = function($mdThemingProvider) {
    return $mdThemingProvider.theme('default').primaryPalette('cyan');
  };

  AppConfig.$inject = ['$mdThemingProvider', '$locationProvider'];

  angular.module('ngElement', ['ngRoute', 'ngMaterial', 'uuid']).config(AppConfig).controller('AppCtrl', AppCtrl);

}).call(this);
