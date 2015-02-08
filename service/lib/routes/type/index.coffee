Type             = require( '../../data/type' )
Schema           = require( '../../data/type/schema' )
authentication   = require( '../../authentication' )
uuid             = require( 'node-uuid' )
Q                = require( 'q' )
_                = require( 'lodash' )
element          = require( './element' )
RevisionResource = require( '../../revision-resource' )

TypeRevisionResource = new RevisionResource( 'Type', Schema )

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

exports.post = ( req, res, next ) ->
  exports.put( req, res, next )

exports.put = ( req, res ) ->

  instance = TypeRevisionResource.create( )

  instance.organization_id = req.user.organization_id
  instance.revision_map_key = req.params.key

  instance.name = req.body.name
  instance.description = req.body.description
  instance.definition = req.body.definition

  TypeRevisionResource
  .save( instance )
  .then( ( instance ) ->

    unless req.params?.key?
      res.header( "Location", "/api/type/#{ instance.revision_map_key }" )

    status = if instance.$revision is 0 then 201 else 204
    res.send( status )
  )
  .fail( ( error ) ->
    res.send( 500, error )
  )

exports.get = ( req, res ) ->

  TypeRevisionResource
  .findRevision(
    req.params.key,
    req.params.revision,
    req.user.organization_id
  )
  .then( ( instance ) ->
    res.send( 200, instance )
  )
  .fail( ( error ) ->
    res.send( 500, error )
  )


exports.getDefinition = ( req, res ) ->
  TypeRevisionResource
  .findRevision(
    req.params.key,
    req.params.revision,
    req.user.organization_id
  )
  .then( ( instance ) ->
    instance
    .getDefinition( )
    .then( ( definition ) ->
      res.send( 200, definition )
    )
    .fail( ( error ) ->
      res.send( 500, error )
    )
  )
  .fail( ( error ) ->
    res.send( 500, error )
  )


exports.del = ( req, res ) ->

exports.find = ( req, res ) ->

  TypeRevisionResource
  .getAll(
    req.user.organization_id,
    false
  )
  .then( ( documents ) ->
    res.send( 200, documents )
  )
  .fail( ( error ) ->
    return res.send( 500, error )
  )

