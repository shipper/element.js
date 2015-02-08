mongoose = require( 'mongoose' )
schema   = require( './schema' )

exports.define = ( name ) ->
  return mongoose.model( "#{ name }.revision", schema )