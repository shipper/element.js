ElementCtrl = ( $scope, $http, $routeParams ) ->

  $scope.key = $routeParams.key

  $scope.save = ->

    element = $scope.element

    method = 'post'
    query = '/api/element'
    if $scope.key?
      method = 'put'
      query += "/#{ $scope.key }"

    $http[ method ]( query, element )
    .success( ( data, status, headers ) ->

      unless method is 'post'
        return
      location = headers().location

      regex = /\/?api\/element\/(.+)\/?/g

      $scope.key = regex.exec( location )[ 1 ]
    )

  $scope.select = ->

  $http.get( "/api/type/#{ $routeParams.type }/definition" )
  .success( ( definition ) ->
    $scope.definition = definition

    if $routeParams.key
      $http.get( "/api/element/#{ $routeParams.key }" )
      .then( ( element ) ->
        $scope.element = element
      )
    else
      $scope.element = { }

  )


ElementCtrl.$inject = [ '$scope', '$http', '$routeParams' ]

ElementConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/type/:type/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl'
    })

ElementConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( ElementConfig )
.controller( 'ElementCtrl', ElementCtrl )