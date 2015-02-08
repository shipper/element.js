Type            = require( '../../data/type' )
authentication  = require( '../../authentication' )
uuid            = require( 'node-uuid' )
Q               = require( 'q' )
_               = require( 'lodash' )
element         = require( './element' )

exports.register = ( server ) ->

  element.register( server )

  server.get(  '/api/type/base',                            exports.base          )

  server.get(  '/api/type',                 authentication, exports.find          )

  server.post( '/api/type',                 authentication, exports.post          )
  server.put(  '/api/type/:key',            authentication, exports.put           )
  server.get(  '/api/type/:key',            authentication, exports.get           )
  server.get(  '/api/type/:key/definition', authentication, exports.getDefinition )
  server.del(  '/api/type/:key',            authentication, exports.del           )

exports.base = ( req, res ) ->

  base = { }
  for own key, val of Type.Base
    if val.disabled
      continue
    base[ key ] = val
  res.send( 200, base )

exports.post = ( req, res ) ->
  type = new Type(
    req.body
  )

  type.organization_id = req.user.organization_id
  type.key = uuid.v4( )

  type.save( ( err, type ) ->
    if err
      return res.send( 500, err )

    res.header( "Location", "/api/type/#{ type.key }" )
    res.send( 201 )
  )

exports.put = ( req, res ) ->
  deferred = Q.defer( )

  isNew = false

  Type.find(
    {
      key: req.params.key,
      organization_id: req.user.organization_id
    },
    ( err, types ) ->
      unless err or types.length is 0
        return deferred.resolve( types[ 0 ] )
      isNew = true
      type = new Type(
        key: req.params.key,
        organization_id: req.user.organization_id
      )

      deferred.resolve( type )

      return
  )

  deferred
  .promise
  .then( ( type ) ->
    type.name = req.body.name
    type.description = req.body.description
    type.definition = req.body.definition

    deferred = Q.defer( )
    type.save( ( err ) ->
      if err
        return deferred.resolve( err )
      deferred.resolve( type )
    )
    return deferred.promise
  )
  .then( ->
    res.send( if isNew then 203 else 204 )
  )
  .fail( ( error ) ->
    res.send( 500, error )
  )

exports.get = ( req, res ) ->
  Type.find(
    {
      key: req.params.key,
      organization_id: req.user.organization_id
    },
    ( err, type ) ->
      if err or not type?.length
        return res.send( 404 )
      return res.send( 200, {
        name: type[ 0 ].name
        description: type[ 0 ].description
        definition: type[ 0 ].definition
      })
  )

exports.getDefinition = ( req, res ) ->
  Type.find(
    {
      key: req.params.key,
      organization_id: req.user.organization_id
    },
    ( err, type ) ->
      if err or not type?.length
        return res.send( 404 )
      type[ 0 ]
      .getDefinition( )
      .then( ( definition ) ->
        res.send( 200, definition )
      )
      .fail( ( error ) ->
        res.send( 500, error )
      )
  )

exports.del = ( req, res ) ->

exports.find = ( req, res ) ->

  query = Type.find(
    {
      organization_id: req.user.organization_id
    }
  )

  query.exec( ( err, types ) ->
    if err
      return res.send( 500, err )
    res.send( 200, _.map( types, ( type ) ->
      return {
        key: type.key
        name: type.name
        description: type.description
        definition: type.definition
      }
    ))
  )

