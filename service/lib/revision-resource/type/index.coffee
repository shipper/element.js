Schema           = require( '../../data/type/schema' )
RevisionResource = require( '../index' )

class TypeRevisionResource extends RevisionResource
  constructor: ->
    super( 'Type', Schema )

module.exports = new TypeRevisionResource( )