HomeCtrl = ( $scope, $location, $http ) ->
  $scope.results = [ ]

  find = ->
    $http.get( '/api/type' )
    .success( ( data ) ->
      $scope.results = data
    )

  find( )

  $scope.new = ->
    $location.path( "/type" )

  $scope.goto = ( type ) ->
    $location.path( "/type/#{ type.key }/elements" )

HomeCtrl.$inject = [ '$scope', '$location', '$http' ]

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