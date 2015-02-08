Writable      = require( 'stream').Writable
StreamBuffers = require( 'stream-buffers' )

class WritableStreamBuffer extends Writable
  base: undefined
  constructor: ->
    @base = new StreamBuffers.WritableStreamBuffer( )

    @on( 'finish', =>
      @base.end( )
    )


  _write: ( data ) ->
    @base.write( data )

  getContents: ( length = undefined ) ->
    return @base.getContents( length )

  getContentsAsString: ( encoding = undefined, length = undefined )->
    return @base.getContentsAsString( encoding, length )

module.exports = WritableStreamBuffer


