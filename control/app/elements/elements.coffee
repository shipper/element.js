ElementsCtrl = ( $scope, $http, $location, $routeParams ) ->


  ###
  $http.get( '/api/type' )
  .success( ( data ) ->

    $scope.types = data

    _.each( data, ( type ) ->

      $http.get( "/api/type/#{ type.key }/element" )
      .success( ( elements ) ->
        type.elements = elements
      )
    )

  )
  ###

  $scope.new = ->
    $scope.newElement( $scope.type )

  $scope.delete = ->
    unless confirm( "Are you sure you wish to delete this type?" )
      return
    $http.delete( "/api/type/#{ $routeParams.type }" )
    .success( ->
      $location.path( '/home' )
    )

  $scope.edit = ->
    $scope.goto( $scope.type )

  $http.get( "/api/type/#{ $routeParams.type }" )
  .success( ( data ) ->
    $scope.type = data
  )
  .error( ->
    $location.path( '/home' )
  )

  $http.get( "/api/type/#{ $routeParams.type}/element" )
  .success( ( data ) ->
    $scope.elements = data
  )

  $scope.newElement = ( type ) ->
    $location.path( "/type/#{ type.key }/element" )

  $scope.remove = ( type ) ->


  $scope.goto = ( type ) ->
    $location.path( "/type/#{ type.key }" )

  $scope.gotoElement = ( element ) ->
    $location.path( "/type/#{ $scope.type.key }/element/#{ element.key }" )

  $scope.shouldShow = ( type, element ) ->
    return $scope.getMain( type, element )?

  $scope.getMainProperty = ->
    type = $scope.type

    unless type?
      return

    definition = type.definition

    for own key, val of definition
      unless val.main
        continue
      return key

    return 'Name'

  $scope.getMain = ( element ) ->

    type = $scope.type

    unless type?
      return

    definition = type.definition

    main = null
    not_empty = null
    for own key, val of definition
      unless val.main
        if not not_empty? and element.data?[ key ]?
          not_empty = key
          if main?
            break
        continue
      main = key
      if not_empty?
        break

    if main? and element.data?[ main ]?
      return element.data?[ main ]

    return element.data?[ not_empty ]


ElementsCtrl.$inject = [ '$scope', '$http', '$location', '$routeParams' ]

ElementsConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/type/:type/elements', {
    templateUrl: 'app/elements/elements.html',
    controller: 'ElementsCtrl'
    data:
      back: '/home'
  })

  ###
  .when( '/elements/:type?', {
    templateUrl: 'app/elements/elements.html',
    controller: 'ElementsCtrl'
  })
  ###

ElementsConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( ElementsConfig )
.controller( 'ElementsCtrl', ElementsCtrl )