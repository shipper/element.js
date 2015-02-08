Element                   = require( '../../data/element' )
Q                         = require( 'q' )
{ WritableStreamBuffer }  = require( 'stream-buffers' )
put                       = require( './put' )

exports.post = ( req, res ) ->


  put
  .requestToData( req )
  .then( ( data ) ->

    element = new Element(
      organization_id: req.user.organization_id
      data: data
    )

    element.base_id = element.id

    return element.savePromise( )
  )
  .then( ( element ) ->
    res.header( "Location", "/api/element/#{ element.key }" )
    res.send( 201 )
  )
  .fail( ( error ) ->
    res.send( 503 , error )
  )

