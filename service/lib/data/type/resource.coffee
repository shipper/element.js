TypeRevisionResource = require( '../../revision-resource/type' )

exports.definition = {
  Name: {
    Base: {
      name: "Text"
      key: "String"
      type: "string"
    }
    type: 'string'
    required: true
    index: 0
  },
  Description: {
    Base: {
      name: "Text"
      key: "String"
      type: "string"
    }
    type: 'string'
    required: true
    index: 1
  },
  Resource: {
    Base: {
      name: "Nested Object"
      key: "Object"
      type: "object"
    }
    type: 'string'
    required: true
    index: 2
    definition: {
      element: {
        Base: {
          name: "Text"
          key: "String"
          type: "string"
        }
        type: 'string'
      }
    }
  }
}

exports.get = ( org, library = undefined ) ->

  map_key = "$$resource"

  return TypeRevisionResource
  .findRevision(
    map_key,
    0,
    org,
    'key',
    library
  )
  .fail( ->
    instance = TypeRevisionResource.create( )

    instance.organization_id = org
    instance.revision_map_key = map_key

    instance.name = "Resource"
    instance.description = "Type to group resources"
    instance.definition = exports.definition

    instance.library = library

    instance.resource = true

    return TypeRevisionResource
    .save( instance )
  )

