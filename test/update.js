var test = require('tape')
var former = require('../')

test('basic operation', function(t){

  var object = {
    textInput: 'Text',
    select: '1',
    checks: {
      checkedBox: true,
      uncheckedBox: false
    },
    radio: 'option 2',
    extraValue: '123'
  }

  var element = document.createElement('form')

  var textInput = document.createElement('input')
  textInput.name = 'textInput'
  textInput.type = 'text'
  element.appendChild(textInput)

  var select = document.createElement('select')
  select.setAttribute('name', 'select')
  select.innerHTML = '<option value="1">Choice 1</option><option value="2">Choice 2</option>'
  element.appendChild(select)


  var checkedBox = document.createElement('input')
  checkedBox.setAttribute('name', 'checks.checkedBox')
  checkedBox.setAttribute('type', 'checkbox')
  element.appendChild(checkedBox)

  var uncheckedBox = document.createElement('input')
  uncheckedBox.setAttribute('name', 'checks.uncheckedBox')
  uncheckedBox.setAttribute('type', 'checkbox')
  element.appendChild(uncheckedBox)

  var radio1 = document.createElement('input')
  radio1.setAttribute('name', 'radio')
  radio1.setAttribute('type', 'radio')
  radio1.setAttribute('value', 'option 1')
  element.appendChild(radio1)


  var radio2 = document.createElement('input')
  radio2.setAttribute('name', 'radio')
  radio2.setAttribute('type', 'radio')
  radio2.setAttribute('value', 'option 2')
  element.appendChild(radio2)


  var radio3 = document.createElement('input')
  radio3.setAttribute('name', 'radio')
  radio3.setAttribute('type', 'radio')
  radio3.setAttribute('value', 'option 3')
  element.appendChild(radio3)

  var form = former(element, object, function(action, updatedObject){

    t.deepEqual(updatedObject, {
      textInput: 'A new value',
      select: '2',
      checks: {
        checkedBox: true,
        uncheckedBox: true
      },
      radio: 'option 1',
      extraValue: object.extraValue
    }, 'Values updated and extra value preserved')

    t.end()
  })

  t.deepEqual({
    textInput: textInput.value,
    select: select.value,
    checks: {
      checkedBox: checkedBox.checked,
      uncheckedBox: uncheckedBox.checked
    },
    radio: radio2.value,
    extraValue: object.extraValue
  }, object, 'fields populated for object')

  // change form values
  textInput.value = 'A new value'
  select.value = '2'
  uncheckedBox.checked = true
  radio1.checked = true

  // save button
  form.triggerAction('save')

})

test('action buttons', function(t){
  t.plan(2)


  var element = document.createElement('form')
  var actionButton = document.createElement('button')
  actionButton.type = 'button'
  actionButton.setAttribute('data-action', 'save')
  element.appendChild(actionButton)

  var actionLink = document.createElement('a')
  actionLink.href = '#'
  actionLink.setAttribute('data-action', 'cancel')
  element.appendChild(actionLink)

  var saving = true

  former(element, function(action, object){
    if (action == 'save' && saving){
      t.ok(true, 'Save button triggers action')
    } else if (action == 'cancel' && !saving){
      t.ok(true, 'Cancel button triggers action')
      t.end()
    } else {
      t.ok(false, 'Problem with actions')
    }
  })

  actionButton.click()
  saving = false
  actionLink.click()
})

function simulateEvent(element, event){
  if ( element.dispatchEvent ) {
    element.dispatchEvent(event)
  } else if (element.fireEvent ){
    element.fireEvent("on" + type, event);
  }
}
