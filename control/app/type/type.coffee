class Property
  constructor: ( @name, @type, @$scope ) ->

  remove: ->

    index = @$scope.values.properties.indexOf( @ )

    if index is -1
      return

    @$scope.values.properties.splice( index, 1 )

TypeCtrl = ( $scope, $routeParams, $http ) ->
  $scope.key = $routeParams.key

  $scope.values = {
    name: ''
    description: ''
    properties: [

    ]
  }

  $scope.getDefinition = getDefinition = ->
    definition = { }

    for prop in $scope.values.properties
      definition[ prop.name ] = {
        type: prop.type.type
        schema: prop.type.schema
        required: prop.required
        index: prop.index
      }

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

        $scope.values.properties.push( prop )

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

TypeCtrl.$inject = [ '$scope', '$routeParams', '$http' ]

TypeConfig = ( $routeProvider ) ->
  $routeProvider
  .when( '/type/:key?', {
    templateUrl: 'app/type/type.html',
    controller: 'TypeCtrl'
  })

TypeConfig.$inject = [ '$routeProvider' ]

angular.module( 'ngElement' )
.config( TypeConfig )
.controller( 'TypeCtrl', TypeCtrl )