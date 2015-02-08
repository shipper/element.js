Element  = require( '../../../data/element/index' )
Q        = require( 'q' )
Revision = require( './revision' )
Group    = require( './group' )
_        = require( 'lodash' )

exports.getElementDetails = ( agent ) ->
  deferred = Q.defer( )

  callback = ( err, elements ) ->
    if err
      return deferred.reject( err )

    base = { }

    _.each( elements, ( element ) ->
      ( base[ element.base_id.toString( ) ] ?= [ ] ).push(
        element
      )
    )

    result = [ ]

    _.each( _.keys( base ), ( key ) ->
      group = base[ key ]
      result.push(
        new Group( group )
      )
    )

    deferred.resolve( result )

  options = {
    organization_id: agent.organization_id
  }

  Element
  .find(
    options,
    callback
  )

  return deferred.promise

exports.getElement = ( agent, key, revision = -1 ) ->
  deferred = Q.defer( )
  callback = ( err, elements ) ->
    if err or elements.length is 0
      return deferred.reject( err )

    if revision isnt -1
      return deferred.resolve( elements[ 0 ] )

    element = null
    for val in elements
      unless element?
        element = val
        continue
      if element.revision < val.revision
        element = val

    deferred.resolve( element )

  options =
  {
    key: key
    organization_id: agent.organization_id
  }

  if revision isnt -1
    r = parseInt( revision, 10 )

    if isNaN( r )
      options.uuid = revision
    else
      options.revision = r

  Element
  .find(
    options,
    callback
  )

  return deferred.promise

exports.getRevisionsArray = ( organization_id, key ) ->

  deferred = Q.defer( )

  callback = ( error, elements ) ->
    if error
      return deferred.reject( error )

    if elements.length is 0
      return deferred.resolve( [ ] )

    base_id = elements[ 0 ].base_id

    error = false

    revisions = _.map( elements, ( element ) ->
      if element.base_id.toString() isnt base_id.toString()
        error = true
        return

      return new Revision( element )
    )

    if error
      return deferred.reject(
        'More then one base for this key'
      )

    revisions = revisions.sort( ( a, b ) ->
      return a.revision - b.revision
    )

    deferred.resolve( revisions )


  Element.find(
    {
      key: key,
      organization_id: organization_id
    },
    'revision create_date uuid base_id',
    callback
  )

  return deferred.promise

exports.getRevisions = ( req, res ) ->
  exports.getRevisionsArray(
    req.user.organization_id,
    req.params.key
  )
  .then( ( array ) ->
    res.send( 200, array )
  )
  .fail( ( error ) ->
    res.send( 503, error )
  )

exports.getMetadata = ( req, res ) ->
  exports.getElement(
    req.user,
    req.params.key,
    req.params.revision
  )
  .then( ( result ) ->
    res.send( 200, {
      revision: result.element.revision
      create_date: result.element.create_date
      unique_key: result.element.uuid
    })
  )
  .fail( ->
    res.send( 404 )
  )

exports.getAll = ( req, res ) ->

  exports.getElementDetails(
    req.user
  )
  .then( ( result ) ->
    res.send( 200, result )
  )
  .fail( ( error ) ->
    res.send( 503, error )
  )



exports.get = ( req, res ) ->

  exports.getElement(
    req.user,
    req.params.key,
    req.params.revision
  )
  .then( ( element ) ->
    data = element.data

    publish_revision = element.publish_revision or 0

    unless element.published
      publish_revision = -1


    res.writeHead(200, {
      'X-Element-Revision': element.revision
      'X-Element-Publish-Revision': publish_revision
      'X-Element-Type': element.type_name
      'X-Element-Type-Id': element.type_id or -1
      'Content-Length': data.data.length
      'Content-Type': data.content_type
    })

    res.write( data.data )

    res.end( )
  )
  .fail( ->
    res.send( 404 )
  )
