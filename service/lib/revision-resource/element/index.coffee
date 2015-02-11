Schema           = require( '../../data/element/schema' )
RevisionResource = require( '../index' )

class ElementRevisionResource extends RevisionResource
  constructor: ->
    super( 'Element', Schema )

module.exports = new ElementRevisionResource( )