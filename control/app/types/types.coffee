TypesCtrl = ( $scope, $http, $location ) ->

  $scope.results = [ ]

  find = ->
    $http.get( '/api/type' )
    .success( ( data ) ->
      $scope.results = data
    )

  find( )

  $scope.goto = ( type ) ->
    $location.path( "/type/#{ type.key }" )


TypesCtrl.$inject = [ '$scope', '$http', '$location' ]

TypesConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/types', {
    templateUrl: 'app/types/types.html',
    controller: 'TypesCtrl'
  })

TypesConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( TypesConfig )
.controller( 'TypesCtrl', TypesCtrl )