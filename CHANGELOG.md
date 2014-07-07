### v2.0.0
##### Added / Updated
- Unlimited nested grouping. Group headers are clickable to select / deselect all items under the group. Group headers are filter aware, means it will only affect filtered result.
- Helper buttons are now filter aware as well (For example, if you filter something and click 'Select All', the directive will tick all of the filtered result only. Same goes with 'Select None' and 'Reset' )
- Supports arrow key navigation (up, down, left, right, and spacebar). 
- New CSS styling
- default-label attribute. You can define your default text on the button when nothing is selected.
- on-item-click attribute. This is a callback which will be triggered when a user click an item. Will pass the clicked item to the callback function.
- on-open and on-close callbacks will now pass the multi-select element (HTML) to the callback function.

##### Removed / Deprecated:
- on-focus attribute is deprecated.
- on-blur attribute is deprecated. Use on-close instead, as it will be triggered when user close a directive by clicking outside the directive.
- IE8 will no longer be supported.

### v1.2.0
##### Added / Updated:
- Default label on the dropdown button is now configurable using attribute "default-label"="..." (Issue #19)
- Attribute "max-labels" can now be 0. If set to 0, the dropdown button will only display "(Total: X)" (Issue #16)

### v1.1.0
##### Added / Updated:
- Added event callbacks
- Helper elements are now configurable (Issue #5)

### v1.0.0
First release
