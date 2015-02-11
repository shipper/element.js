ElementCtrl = ( $scope, $http, $routeParams, $q ) ->

  $scope.key = $routeParams.key

  $scope.element = { }
  $scope.new = true

  $scope.$emit( 'back-path', "/type/#{ $routeParams.type }/elements" )

  $scope.saveWording = ->
    return if $scope.new then 'Save' else 'Update'


  $scope.save = ->

    element = $scope.element

    method = 'POST'
    query = '/api/element'
    if $scope.key?
      method = 'PUT'
      query += "/#{ $scope.key }"

    headers = {
      'X-Element-Type-Key': $routeParams.type,
      'X-Element-Type-Revision': $scope.type_revision
    }

    options = {
      method: method
      url: query
      headers: headers
      data: element
    }

    $http( options )
    .success( ( data, status, headers ) ->

      unless method is 'post'
        return
      location = headers( 'Location' )

      regex = /\/?api\/element\/(.+)\/?/g

      $scope.key = regex.exec( location )[ 1 ]
    )

  $scope.select = ->

  query = "/api/type/#{ $routeParams.type }"

  if $routeParams.key
    promise = $http.get( "/api/element/#{ $routeParams.key }" )
    .success( ( element, status, headers ) ->
      $scope.element = element or { }
      $scope.new = !element

      key = headers( 'X-Element-Type-Key' )

      if key is $routeParams.type
        $scope.type_revision = headers( 'X-Element-Type-Revision' )

        query += "/revision/#{ headers( 'X-Element-Type-Revision' ) }"
    )
  else
    deferred = $q.defer( )
    deferred.resolve( )
    promise = deferred.promise

  toArray = ( definition ) ->

    return _.map( _.keys( definition ), ( key ) ->
      return {
        key: key
        value: definition[ key ]
        index: definition[ key ].index
      }
    )
    .sort( ( a, b ) ->
      return a.index - b.index
    )


  promise
  .then( ->

    query += "/definition"

    $http.get( query )
    .success( ( definition ) ->
      $scope.definition = definition
      $scope.definitionArray = toArray( definition )
    )

    if $scope.type_revision?
      $http.get( "/api/type/#{ $routeParams.type }/definition" )
      .success( ( definition ) ->
        all = true
        for own key of $scope.definition
          if definition.hasOwnProperty( key )
            continue
          all = false
          break
        unless all
          return
        $scope.definition = definition
        $scope.definitionArray = toArray( definition )
      )
  )



ElementCtrl.$inject = [ '$scope', '$http', '$routeParams', '$q' ]

ElementConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/type/:type/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl'
      data:
        title: 'Element'
    })
  .when( '/type/:type/revision/:type_revision/element/:key?', {
      templateUrl: 'app/element/element.html',
      controller: 'ElementCtrl'
      data:
        title: 'Element'
    })

ElementConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( ElementConfig )
.controller( 'ElementCtrl', ElementCtrl )