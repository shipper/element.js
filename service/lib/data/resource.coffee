Q = require( 'q' )

class Resource
  constructor: ( @type, @data_key = null, @key = 'uuid' ) ->

  httpPut: ( req, res ) ->
    promise = @_put(
      req.user,
      req.body,
      req.params.key
    )
    @_res( promise, res )

  httpPost: ( req, res ) ->
    return put( req, res )

  httpGet: ( req, res ) ->
    promise = @_del(
      req.user,
      req.params.key
    )
    @_res( promise, res )

  httpDel: ( req, res ) ->
    promise = @_del(
      req.user,
      req.params.key
    )
    @_res( promise, res )

  _res: ( promise, res ) ->
    promise
    .then( ( result ) ->
      res.send(
        result.status,
        result.body
      )
    )

  _assign: ( instance, values ) ->

    if @data_key?
      instance[ @data_key ] = values
      return

    for own key, val of values
      instance[ key ] = val

  get: ( agent, key ) ->
    unless uuid?
      return Q.resolve(
        success: false
        status: 404
      )

    deferred = Q.defer( )

    options = { }
    options[ @key ] = key

    callback = ( err, data ) ->
      if err or data.length is 0
        return deferred.reject( err or 'Not Found' )
      return deferred.resolve( data[ 0 ] )

    @Type
    .find(
      options,
      callback
    )

    return deferred
    .promise
    .then( ( doc ) =>
      if (
        doc.organization_id? and
        doc.organization_id isnt agent?.organization_id
      )
        return Q.resolve(
          success: false
          status: 401
        )
      data = doc
      if @data_key
        data = doc?[ @data_key ]

      return {
        success: true
        status: 200
        body: data
        document: doc
        key: doc.uuid
      }
    )
    .fail( ->
      return {
        success: false
        status: 404
        key: key
      }
    )

  del: ( agent, key ) ->
    return @get( agent, key )
    .then( ( result ) ->
      document = result.document
      return document.removePromise( )
    )
    .then( ->
      return {
        success: true
        status: 200
      }
    )
    .fail( ->
      return {
        success: false
        status: 404
        key: key
      }
    )

  put: ( agent, data, key ) ->
    return @get( agent, key )
    .fail( =>

      type = @type
      document = new type( )
      if document.organization_id?
        document.organization_id = agent.organization_id

      return document
    )
    .then( ( document ) =>
      @_assign( document, data )
      return document.savePromise( )
    )
    .then( ( document ) =>
      return {
        success: true
        status: 200,
        body: if @data_key? then document[ @data_key ] else document
        key: document.uuid
      }
    )
    .fail( ->
      return {
        success: false
        status: 503
      }
    )

module.exports = Resource

