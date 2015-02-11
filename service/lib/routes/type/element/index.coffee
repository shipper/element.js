authenticate            = require( '../../../authentication' )
Q                       = require( 'q' )
_                       = require( 'lodash' )

TypeRevisionResource    = require( '../../../revision-resource/type' )
ElementRevisionResource = require( '../../../revision-resource/element' )
{ ObjectId }            = require( 'mongoose' ).Types

exports.register = ( server ) ->

  server.get( "/api/type/:type/element/:element", authenticate, exports.get )
  server.get( "/api/type/:type/element", authenticate, exports.getAll )

exports.getAll = ( req, res ) ->

  TypeRevisionResource
  .findRevision(
    req.params.type,
    req.params.type_revision,
    req.user.organization_id,
    'key',
    req.params.library
  )
  .then( ( type ) ->

    deferred = Q.defer( )
    callback = ( err, docs ) ->

      if err
        return deferred.reject( err )

      keys = [ ]

      _.each( docs, ( doc ) ->
        id = doc.revision_map_id.toString( )
        if keys.indexOf( id ) isnt -1
          return
        keys.push( id )
      )

      return deferred.resolve( keys )

    options = {
      type_revision_map_id: type.revision_map_id
      organization_id: req.user.organization_id
    }

    if req.params.library?
      options.library = req.params.library

    ElementRevisionResource
    .model
    .find( options, 'revision_map_id' )
    .exec( callback )

    return deferred.promise

  )
  .then( ( keys ) ->

    docs = [ ]

    promises = _.map( keys, ( key ) ->

      return ElementRevisionResource
      .findRevision(
        key,
        undefined,
        req.user.organization_id,
        'id',
        req.params.library
      )
      .then( ( doc ) ->
        docs.push( doc )
      )
      .fail( ( err ) ->
        console.log( err )
        return true
      )
    )

    return Q
    .all( promises )
    .then( ->
      return docs
    )
  )
  .then( ( docs ) ->

    elements = [ ]

    _.each( docs, ( doc ) ->
      data = doc.data.data?.toString( )

      try
        json = JSON.parse( data )
      catch
        return

      elements.push(
        {
          key: doc.revision_map_key
          revision: doc.revision or 0
          create_date: doc.create_date
          update_date: doc.update_date
          data: json
        }
      )
    )

    res.send( 200, elements )
  )
  .fail( ( err ) ->
    console.log( err, err.stack )
    res.send( 500, err )
  )

exports.get = ( req, res ) ->

  TypeRevisionResource
  .findRevision(
    req.params.type,
    req.params.type_revision,
    req.user.organization_id
  )
  .then( ( type ) ->
    return ElementRevisionResource
    .findRevision(
      req.params.element,
      req.params.element_revision,
      req.user.organization_id
    )
    .then( ( element ) ->

      if element.type_revision_map_id isnt type.revision_map_id
        return res.send( 401, 'Unauthorized' )

      if element.data.content_type isnt 'application/json'
        return res.send( 400, 'Bad Request' )

      data = element.data.data.toString( )

      json = JSON.parse( data )

      return res.send( 200, json )
    )
  )
  .fail( ( err ) ->
    res.send( 500, err )
  )


exports.put = ( req, res ) ->

exports.post = ( req, res ) ->

exports.del = ( req, res ) ->

exports.find = ( req, res ) ->

