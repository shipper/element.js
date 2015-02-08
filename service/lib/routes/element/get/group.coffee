class ElementGroup
  elements: undefined
  base_id: undefined
  key: undefined
  create_date: undefined
  update_date: undefined
  type: undefined
  constructor: ( elements = [ ] ) ->

    @elements = elements.sort( ( a, b ) ->
      return a.revision - b.revision
    )

    first = @elements[ 0 ]
    unless first?
      return

    @base_id = first.base_id
    @key = first.key
    @create_date = first.create_date

    last = @elements[ @elements.length - 1 ]

    @update_date = last.create_date
    @type = last.type

  toJSON: ->
    return {
      create_date: @create_date
      update_date: @update_date
      key: @key
      revisions: @elements.length
    }

module.exports = ElementGroup