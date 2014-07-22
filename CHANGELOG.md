### v2.0.1
##### Added / Updated
- <a href="https://github.com/isteven/angular-multi-select/issues/52">#52</a> Form tag is now properly closed

### v2.0.0
##### Added / Updated
- Unlimited nested grouping. Group headers are clickable to select / deselect all items under the group. Group headers are filter aware, means it will only affect filtered result.
- Helper buttons are now filter aware as well (For example, if you filter something and click 'Select All', the directive will tick all of the filtered result only. Same goes with 'Select None' and 'Reset' )
- Supports arrow key navigation (up, down, left, right, and spacebar). 
- New CSS styling
- default-label attribute. You can define your default text on the button when nothing is selected.
- on-item-click attribute. This is a callback which will be triggered when a user click an item. Will pass the clicked item to the callback function.
- on-open and on-close callbacks will now pass the multi-select element (HTML) to the callback function.
- max-height attribute. You can define the height of the selection items container.

##### Removed / Deprecated:
- on-focus attribute is deprecated.
- on-blur attribute is deprecated. Use on-close instead, as it will be triggered when user close a directive by clicking outside the directive.
- IE8 will no longer be supported.

### v1.2.0
##### Added / Updated:
- <a href="https://github.com/isteven/angular-multi-select/issues/19">#19</a> Default label on the dropdown button is now configurable using attribute "default-label"="..."
- <a href="https://github.com/isteven/angular-multi-select/issues/16">#16</a> Attribute "max-labels" can now be 0. If set to 0, the dropdown button will only display "(Total: X)"

### v1.1.0
##### Added / Updated:
- Added event callbacks
- <a href="https://github.com/isteven/angular-multi-select/issues/5">#5</a> Helper elements are now configurable

### v1.0.0
First release
