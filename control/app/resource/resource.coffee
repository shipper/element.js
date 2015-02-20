ResourceCtrl = ( $scope, $location, $http ) ->
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

ResourceCtrl.$inject = [ '$scope', '$location', '$http' ]

ResourceConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/resource/:key?', {
    templateUrl: 'app/resource/resource.html',
    controller: 'ResourceCtrl'
  })

ResourceConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( ResourceConfig )
.controller( 'ResourceCtrl', ResourceCtrl )