ResourcesCtrl = ( $scope, $location, $http ) ->
  $scope.resources = [ ]

  


ResourcesCtrl.$inject = [ '$scope', '$location', '$http' ]

ResourcesConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/resources', {
    templateUrl: 'app/resources/resources.html',
    controller: 'ResourcesCtrl'
  })

ResourcesConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( ResourcesConfig )
.controller( 'ResourcesCtrl', ResourcesCtrl )