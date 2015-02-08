class ElementRevision
  revision: 0
  base_id: null
  uuid: null
  create_date: null
  constructor: ( data = undefined ) ->
    if data?
      @revision     = data.revision
      @base_id      = data.base_id
      @uuid         = data.uuid
      @create_date  = data.create_date

  toJSON: ->
    return {
      revision: @revision
      unique_key: @uuid
      create_date: @create_date
    }


module.exports = ElementRevision