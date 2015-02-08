Element                   = require( '../../data/element' )
Q                         = require( 'q' )
{ WritableStreamBuffer }  = require( 'stream-buffers' )
get                       = require( './get' )
Type                      = require( '../../data/type' )

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

exports.publish = ( req, res ) ->
  get.getElement(
    req.user,
    req.params.key,
    req.params.revision
  )
  .then( ( element ) ->

  )

exports.put = ( req, res ) ->
  values = {
    data: null
    revision: 0
    base_id: null
  }

  promises = [ ]

  promises.push(
    exports.requestToData( req )
    .then( ( data ) ->
      values.data = data
    )
  )

  promises.push(
    get.getRevisionsArray(
      req.user.organization_id,
      req.params.key
    )
    .then( ( revisions ) ->
      last = revisions[ revisions.length - 1 ]

      unless last?
        return

      values.base_id  = last.base_id
      values.revision = last.revision + 1
    )
  )

  Q.all(
    promises
  )
  .then( ->
    values.element = element = new Element(
      organization_id: req.user.organization_id
      key: req.params.key
      revision: values.revision
      data: values.data
    )

    element.base_id = values.base_id or element.id

    return element.savePromise( )
  )
  .then( ->
    if values.revision is 0
      return res.send( 203 )
    return res.send( 204 )
  )
  .fail( ( error ) ->
    return res.send( 503, error )
  )