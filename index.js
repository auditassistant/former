module.exports = function(element, object, cb){
  // cb: function(action, object)

  if (!cb && typeof object == 'function'){
    cb = object
    object = {}
  }

  var dataNodes = []

  function trigger(action){
    var result = obtain(object || {})
    dataNodes.forEach(function(e){
      if (!isHidden(e) && isEnabled(e)){
        var value = getElementValue(e)
        if (typeof value != 'undefined'){
          setObjectValue(result, e.getAttribute('name'), value)
        }
      }
    })
    cb(action, result)
  }

  walkDom(element, function(e){
    if (isDataNode(e)){
      var key = e.getAttribute('name')
      var value = getObjectValue(object, key)
      setElementValue(e, value)
      dataNodes.push(e)
    } else if (isTrigger(e) && cb){
      handleClick(e, trigger)
    }
  })

  element.triggerAction = trigger

  return element
}

function handleClick(element, cb){
  if (element.addEventListener) {
    element.addEventListener('click', function(e){
      e.preventDefault()
      e.stopPropagation()
      cb(element.getAttribute('data-action'))
    }, false)
  } else if (element.attachEvent) {
    return element.attachEvent('onclick', function(){
      event.returnValue = false;
      cb(element.getAttribute('data-action'))
    })
  }
}

function isDataNode(node){
  return node && node.getAttribute && !!node.getAttribute('name')
}

function isEnabled(node){
  return node.disabled !== true
}

function isTrigger(node){
  return node && node.getAttribute && !!node.getAttribute('data-action')
}

function getElementValue(node){
  if (node.getValue){
    return node.getValue()
  } else if (node.nodeName == 'INPUT' && node.type == 'checkbox'){
    return node.checked
  } else if (node.nodeName == 'INPUT' && node.type == 'radio'){
    if (node.checked){
      return node.value
    }
  } else {
    return node.value
  }
}

function setElementValue(node, value){
  if (node.setValue){
    node.setValue(value)
  } else if (node.nodeName == 'INPUT' && node.type == 'checkbox'){
    node.checked = value
  } else if (node.nodeName == 'INPUT' && node.type == 'radio'){
    node.checked = node.value == value
  } else if (node.nodeName == 'INPUT' && node.type == 'hidden') {
    // pass thru
  } else {
    node.value = value || ''
  }
}

function getObjectValue(object, key){
  var splitPoint = key.indexOf('.')
  if (object instanceof Object){
    if (~splitPoint){
      return getObjectValue(object[key.slice(0, splitPoint)], key.slice(splitPoint + 1))
    } else {
      return object[key]
    }
  } else {
    return null
  }
}

function setObjectValue(object, key, value){
  var splitPoint = key.indexOf('.')
  if (~splitPoint){
    var subObject = object[key.slice(0, splitPoint)]
    if (!(subObject instanceof Object)){
      subObject = object[key.slice(0, splitPoint)] = {}
    }
    setObjectValue(subObject, key.slice(splitPoint + 1), value)
  } else {
    object[key] = value
  }
}

function obtain(object){
  return JSON.parse(safeStringify(object))
}

function safeStringify(object){
  return JSON.stringify(object, function(k,v){
    if (typeof k != 'string' || k.charAt(0) != '$'){ return v }
  })
}


function walkDom(rootNode, iterator){
  var currentNode = rootNode.firstChild
  while (currentNode){
    iterator(currentNode)
    if (currentNode.firstChild){
      currentNode = currentNode.firstChild
    } else {
      while (currentNode && !currentNode.nextSibling){
        if (currentNode !== rootNode) {
          currentNode = currentNode.parentNode
        } else {
          currentNode = null
        }
      }
      currentNode = currentNode && currentNode.nextSibling
    }
  }
}

function isHidden(element){
  while (element){
    if (element.hidden){
      return true
    } else {
      element = element.parentNode
    }
  }
}