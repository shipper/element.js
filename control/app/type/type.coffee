class Property
  constructor: ( @name, @type, @$scope ) ->

  remove: ->

    props = @$scope.values.properties

    index = props.indexOf( @ )

    if index is -1
      return

    props.splice( index, 1 )

  isTop: ->
    return @$scope.values.properties.indexOf( @ ) is 0

  isBottom: ->
    props = @$scope.values.properties
    return props.indexOf( @ ) is props.length - 1

  up: ->

    props = @$scope.values.properties

    index = props.indexOf( @ )

    if index < 1
      return

    props[ index ] = props[ index - 1 ]
    props[ index - 1 ] = @

    @index = index - 1

  down: ->
    props = @$scope.values.properties

    index = props.indexOf( @ )

    if index >= props.length - 1
      return

    props[ index ] = props[ index + 1 ]
    props[ index + 1 ] = @

    @index = index + 1




TypeCtrl = ( $scope, $routeParams, $http, rfc4122 ) ->
  $scope.key = $routeParams.key

  $scope.values = {
    name: ''
    description: ''
    properties: [

    ],
    main: null
    true: true
    false: false
  }

  $scope.isNotSavable = ->
    return not (
      $scope.values.main?.length and
      $scope.values.properties?.length and
      $scope.values.name?.length
    )

  $scope.getDefinition = getDefinition = ->
    definition = { }

    for prop, index in $scope.values.properties
      opts = {
        type: prop.type.type
        schema: prop.type.schema
        required: prop.required
        index: index
        base: prop.type
      }
      if $scope.values.main is prop.uuid
        opts.main = true
        opts.required = true

      definition[ prop.name ] = opts

    return definition

  getType = ->

    definition = getDefinition( )

    type = {
      name: $scope.values.name
      description: $scope.values.description
      definition: definition
    }

    return type

  $scope.save = ->
    type = getType( )

    method = 'post'
    query = '/api/type'
    if $scope.key?
      method = 'put'
      query += "/#{ $scope.key }"

    $http[ method ]( query, type )
    .success( ( data, status, headers ) ->

      unless method is 'post'
        return
      location = headers().location

      regex = /\/?api\/type\/(.+)\/?/g

      $scope.key = regex.exec( location )[ 1 ]
    )

  $scope.property = {
    name: ''
    type: null
    required: false
    addClass: ->
      if $scope.property.valid()
        return
      return 'disabled'
    valid: ->
      return (
        $scope.property.name?.length and
        #/^[\w\-\/\.]*$/.test( $scope.property.name ) and
        $scope.property.type?.name? and
        $scope.property.type?.type?
      )
    add: ->
      unless $scope.property.valid()
        return
      prop = new Property(
        $scope.property.name,
        $scope.property.type,
        $scope
      )

      prop.uuid = rfc4122.v4( )

      unless $scope.values.main?.length
        $scope.values.main = prop.uuid

      prop.required = $scope.property.required

      index = 0
      prop.index = index
      for property in $scope.values.properties
        index += 1
        property.index = index

      $scope.values.properties.unshift( prop )

      $scope.property.name = ''
      $scope.property.type = null
      $scope.property.required = false

  }

  if $scope.key?
    $http.get( "/api/type/#{ $scope.key }")
    .success( ( data ) ->
      $scope.values.name = data.name
      $scope.values.description = data.description

      for own key, val of data.definition

        prop = new Property(
          key,
          val.type,
          $scope
        )

        prop.required = val.required
        prop.index = val.index

        prop.uuid = rfc4122.v4( )

        if val.main or not $scope.values.main?.length
          $scope.values.main = prop.uuid

        $scope.values.properties.push( prop )


        $scope.values.properties = $scope.values.properties.sort( ( a, b ) ->
          return a.index - b.index
        )

      $http.get( '/api/type/base')
      .success(( data ) ->
        for val in $scope.values.properties
          for own key of data
            type = data[ key ]
            unless type.type is val.type
              continue
            val.type = type
            break
      )
    )

TypeCtrl.$inject = [ '$scope', '$routeParams', '$http', 'rfc4122' ]

TypeConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/type/:key?', {
    templateUrl: 'app/type/type.html',
    controller: 'TypeCtrl'
    data:
      title: 'Type'
      back: '/home'
  })

TypeConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( TypeConfig )
.controller( 'TypeCtrl', TypeCtrl )