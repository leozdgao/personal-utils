Utils =
  getComputedStyle: (elem, style) ->
    # may be some ie compatibility issue here
    if(window.getComputedStyle) then window.getComputedStyle(elem)[style] else elem.currentStyle[style];

  getContentWidth: (elem) ->
    width = parseInt @getComputedStyle elem, 'width'
    if @getComputedStyle elem, 'box-sizing' is 'border-box'
      paddingLeft = parseInt @getComputedStyle elem, 'padding-left'
      paddingRight = parseInt @getComputedStyle elem, 'padding-right'

      # return
      return width - paddingLeft - paddingRight
    else return width

  getOuterWidth: (elem) ->
    width = parseInt @getComputedStyle elem, 'width'
    paddingLeft = parseInt @getComputedStyle elem, 'padding-left'
    paddingRight = parseInt @getComputedStyle elem, 'padding-right'
    border = parseInt @getComputedStyle elem, 'border-width'
    marginLeft = parseInt @getComputedStyle elem, 'margin-left'
    marginRight = parseInt @getComputedStyle elem, 'margin-right'

    # return
    return width + paddingRight + paddingLeft + marginRight + marginLeft + border * 2

  getHeight: (elem) ->
    height = parseInt @getComputedStyle elem, 'height'
    paddingTop = parseInt @getComputedStyle elem, 'padding-top'
    paddingBottom = parseInt @getComputedStyle elem, 'padding-bottom'
    border = parseInt @getComputedStyle elem, 'border-width'
    marginButtom = parseInt @getComputedStyle elem, 'margin-bottom'

    if @getComputedStyle elem, 'box-sizing' is 'border-box' then return height + border * 2 + marginButtom
    else return height + paddingTop + paddingBottom + border * 2 + marginButtom

class Waterfall
  constructor: (opts) ->
    # default value
    container = opts?.container or '.wf-container'
    box = opts?.box or '.wf-box'

    # get elements
    @container = document.querySelector container
    @boxes = (@container?.querySelectorAll box) or []

    # composing only find boxes
    if @boxes.length > 0
      # get column first
      do @compose

  getColumn: () ->
    @containerWidth = Utils.getContentWidth @container, 'width'
    @boxWidth = Utils.getOuterWidth @boxes[0]

    # init columns array
    @columns = []
    count = Math.floor @containerWidth / @boxWidth
    while count-- 
      wrap = []
      wrap.height = 0
      @columns.push wrap

  getShortColumnIndex: () ->
    min = @columns[0].height
    console.log min
    index = 0
    for i, wrap of @columns[1..]
      i++
      if wrap.height < min
        console.log 'll'
        min = wrap.height
        index = i
    
    return index

  compose: () ->
    do @getColumn

    for box in @boxes
      index = do @getShortColumnIndex
      positionLeft = @boxWidth * index
      curColumn = @columns[index]
      positionTop = curColumn.height
      # positioning
      box.style.left = positionLeft + 'px'
      box.style.top = positionTop + 'px'
      # push and update height
      curColumn.push(box)
      curColumn.height += Utils.getHeight(box)
    
    console.log @columns

window.Waterfall = Waterfall