authentication            = require( '../../authentication' )
RevisionResource          = require( '../../revision-resource' )
Schema                    = require( '../../data/element/schema' )
{ WritableStreamBuffer }  = require( 'stream-buffers' )
Q                         = require( 'q' )
type                      = require( '../type' )
ElementRevisionResource   = require( '../../revision-resource/element')
TypeRevisionResource      = require( '../../revision-resource/type')
Request                   = require( 'request' )

exports.register = ( server ) ->
  server.get(  '/api/element',                                                   authentication, exports.getAll        )
  server.get(  '/api/library/:library/element',                                  authentication, exports.getAll        )

  #server.put(  '/api/element/:key/publish',                       authentication, put.publish       )
  #server.put(  '/api/element/:key/revisions/:revision/publish',   authentication, put.publish       )
  #server.del(  '/api/element/:key',                               authentication, del.del           )
  server.get(  '/api/element/:key',                                               authentication, exports.get           )
  server.get(  '/api/element/:key/metadata',                                      authentication, exports.getMetadata   )
  server.get(  '/api/element/:key/revision/:revision',                            authentication, exports.get           )
  server.get(  '/api/element/:key/revision/:revision/metadata',                   authentication, exports.getMetadata   )
  server.get(  '/api/element/:key/revision',                                      authentication, exports.getRevisions  )
  server.get(  '/api/library/:library/element/:key',                              authentication, exports.get           )
  server.get(  '/api/library/:library/element/:key/metadata',                     authentication, exports.getMetadata   )
  server.get(  '/api/library/:library/element/:key/revision/:revision',           authentication, exports.get           )
  server.get(  '/api/library/:library/element/:key/revision/:revision/metadata',  authentication, exports.getMetadata   )
  server.get(  '/api/library/:library/element/:key/revision',                     authentication, exports.getRevisions  )

  server.post( '/api/library/:library/element/url/:url',                          authentication, exports.postURL )
  server.put(  '/api/library/:library/element/:key/url/:url',                     authentication, exports.putURL )
  server.post( '/api/library/:library/element/url/:url',                          authentication, exports.postURL )
  server.put(  '/api/library/:library/element/:key/url/:url',                     authentication, exports.putURL )

  killChain = ( method, path, handler ) ->
    route = server[ method ]( path, ->

    )

    server.routes[ route ] = [
      authentication
      server.elementInterceptor
      handler
    ]

  killChain( 'post', '/api/library/:library/element',      exports.post  )
  killChain( 'put',  '/api/library/:library/element/:key', exports.put   )
  killChain( 'post', '/api/element',                      exports.post  )
  killChain( 'put',  '/api/element/:key',                  exports.put   )

exports.getAll = ( req, res ) ->

  ElementRevisionResource
  .getAll(
    req.user.organization_id,
    true
  )
  .then( ( documents ) ->
    res.send( 200, documents )
  )
  .fail( ( error ) ->
    return res.send( 500, error )
  )


exports.getRevisions = ( req, res ) ->
  ElementRevisionResource
  .getRevisions(
    req.params.key,
    req.user.organization_id
  )
  .then( ( revisions ) ->
    return res.send( 200, revisions )
  )
  .fail( ( error ) ->
    return res.send( 500, error )
  )

exports.getMetadata = ( req, res ) ->

  ElementRevisionResource
  .findRevision(
    req.params.key,
    req.params.revision,
    req.user.organization_id
  )
  .then( ( element ) ->
    res.send(
      200,
      {
        revision: element.revision,
        revision_key: element.revision_key,
        key: req.params.key
        data_length: element.data.data.length,
        content_type: element.data.content_type,
        type_key: element.type_revision_map_key
        type_revision: element.type_revision or 0
      }
    )
  )
  .fail( ( error ) ->
    return res.send( 500, error )
  )

exports.get = ( req, res ) ->

  ElementRevisionResource
  .findRevision(
    req.params.key,
    req.params.revision,
    req.user.organization_id
  )
  .then( ( element ) ->

    data = element.data

    headers = {
      'X-Element-Revision': element.revision
      'X-Element-Publish-Revision': -1
      'X-Element-Type-Key': element.type_revision_map_key
      'X-Element-Type-Revision': element.type_revision or 0
      'Content-Length': data.data.length
      'Content-Type': data.content_type
    }

    Object.keys( headers ).forEach( ( key ) ->
      res.setHeader( key, headers[ key ] )
    )

    res.writeHead( 200 )

    res.write( data.data )

    res.end( )

  )
  .fail( ( error ) ->
    return res.send( 500, error )
  )

exports.put = ( req, res ) ->
  exports.putData( exports.requestToData( req ), req, res )

exports.putData = ( dataPromise, req, res ) ->

  instance = ElementRevisionResource.create( )

  instance.organization_id = req.user.organization_id
  instance.revision_map_key = req.params?.key

  instance.type_key = req.header('X-Element-Type-Key')
  instance.type_revision = req.header('X-Element-Type-Revision')

  if typeof instance.type_revision is 'string'
    revision_num = parseInt( instance.type_revision, 10 )

    unless isNaN( revision_num )
      instance.type_revision = revision_num

  promise = Q.resolve( )

  if instance.type_key?
    promise = TypeRevisionResource
    .findRevision(
      instance.type_key,
      instance.type_revision,
      req.user.organization_id
    )
    .then( ( type ) ->
      instance.type_id = type.type_id
      instance.type_revision_map_id = type.revision_map_id
      instance.type_revision = type.revision
      instance.type_revision_map_key = type.revision_map_key

    )

  promise.then( ->
    return dataPromise
    .then( ( data ) ->
      instance.data = data

      return ElementRevisionResource
      .save(
        instance
      )
    )
    .then( ( instance ) ->

      unless req.params?.key?
        res.header( "Location", "/api/element/#{ instance.revision_map_key }" )

      status = if instance.revision is 0 then 201 else 204
      res.send( status )
    )
  )
  .fail( ( error ) ->
    console.log( error, error.stack )
    res.send( 500, error )
  )

exports.post = ( req, res, next ) ->
  exports.put( req, res, next )

exports.requestToData = ( req ) ->
  deferred = Q.defer( )
  stream = new WritableStreamBuffer( )

  req.pipe( stream )

  req.on( 'end', ->
    contents = stream.getContents( ) or new Buffer( 0 )

    deferred.resolve(
      data: contents,
      content_type: req.getContentType( )
    )
  )

  req.on( 'error', ( error ) ->
    deferred.reject( error )
  )

  return deferred.promise


exports.postURL = ( req, res ) ->
  exports.putURL( req, res )

exports.putURL = ( req, res ) ->

  data_request = Request( req.params.url )

  data_request.getContentType ?= ->
    console.log( data_request )
    return data_request.response.headers[ 'content-type' ]

  promise = exports.requestToData( data_request )

  exports.putData( promise, req, res )






