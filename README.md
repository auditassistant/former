former
===

[![browser support](https://ci.testling.com/mmckegg/former.png)](https://ci.testling.com/mmckegg/former)

Populate html form elements with data and return updated object when action button clicked.

Great for use in conjunction with [JSON Context](https://github.com/mmckegg/json-context). 

[![NPM](https://nodei.co/npm/former.png?compact=true)](https://nodei.co/npm/former/)


## Example

```html
<div id='form'>

  <div>
    <strong>Name:</strong> <br />
    <input name='name' type='text' />
  </div>

  <div>
    <strong>Gender:</strong> <br />
    <input name='gender' value='male' type='radio' /> Male <br />
    <input name='gender' value='female' type='radio' /> Female
  </div>

  <div>
    <strong>Favorite Color:</strong <br />
    <select name='favoriteColor'>
      <option value='red'>Red</option>
      <option value='yellow'>Blue</option>
      <option value='green'>Green</option>
    </select>
  </div>

  <div>
    <strong>Enabled hard core mode</strong>
    <input name='options.hardCore' type='checkbox' />
  </div>

  <div>
    <button data-action='save'>Save</button> or
    <a href='#' data-action='cancel'>Cancel</div>
  </div>
</div>
```

```js
var form = require('former')

var element = document.getElementById('form')

var originalObject = {
  name: 'Betty',
  favoriteColor: 'green',
  gender: 'female',
  options: {
    hardCore: false,
    otherOption: true
  },
}

form(element, originalObject, function(action, updatedObject){

  // callback triggered when an element with data-action attribute is clicked
  
  // originalObject remains unchanged. 
  // updatedObject contains changes and any other original 
  //    fields even if they aren't in the form

  if (action == 'save'){
    datasource.pushChange(updatedObject)
  }

})

```