HomeCtrl = ( $scope ) ->

HomeCtrl.$inject = [ '$scope' ]

HomeConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/home', {
    templateUrl: 'app/home/home.html',
    controller: 'HomeCtrl'
  })
  .otherwise( '/home' )

HomeConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( HomeConfig )
.controller( 'HomeCtrl', HomeCtrl )