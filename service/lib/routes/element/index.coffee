authentication            = require( '../../authentication' )
RevisionResource          = require( '../../revision-resource' )
Schema                    = require( '../../data/element/schema' )
{ WritableStreamBuffer }  = require( 'stream-buffers' )
Q                         = require( 'q' )

ElementRevisionResource = new RevisionResource( 'Element', Schema )

exports.register = ( server ) ->
  server.get(  '/api/element',                                    authentication, exports.getAll        )

  #server.put(  '/api/element/:key/publish',                       authentication, put.publish       )
  #server.put(  '/api/element/:key/revisions/:revision/publish',   authentication, put.publish       )
  #server.del(  '/api/element/:key',                               authentication, del.del           )
  server.get(  '/api/element/:key',                               authentication, exports.get           )
  server.get(  '/api/element/:key/metadata',                      authentication, exports.getMetadata   )
  server.get(  '/api/element/:key/revisions/:revision',           authentication, exports.get           )
  server.get(  '/api/element/:key/revisions/:revision/metadata',  authentication, exports.getMetadata   )
  server.get(  '/api/element/:key/revisions',                     authentication, exports.getRevisions  )

  killChain = ( method, path, handler ) ->
    route = server[ method ]( path, ->

    )

    server.routes[ route ] = [
      authentication,
      handler
    ]

  killChain( 'post', '/api/element',      exports.post  )
  killChain( 'put',  '/api/element/:key', exports.put   )

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
      'X-Element-Type-Id': element.type_id or -1
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

  instance = ElementRevisionResource.create( )

  instance.organization_id = req.user.organization_id
  instance.revision_map_key = req.params?.key

  exports.requestToData( req )
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

    status = if instance.$revision is 0 then 201 else 204
    res.send( status )
  )
  .fail( ( error ) ->
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

  return deferred.promise




