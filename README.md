Angular Multi Select
====================
Angular Multi Select is an AngularJS directive which creates a dropdown button with multiple checkboxes. 

<br />![Screenshot](https://raw.githubusercontent.com/isteven/angular-multi-select/master/screenshot.jpg)

Demo: http://jsfiddle.net/HwSJH/19/ or download all the files into a same folder and open multiselect.htm.

Features
--
  - Reset selections to original state
  - Directly updates the input model
  - Load new input model on the fly
  - Configurable, such as:
    - Set which model property to bind to the checkbox status
    - Set orientation of checkboxes
    - Enable / disable checkboxes
    - Set maximum number of items to be displayed on the button label
  - Utilizes AngularJS filter
  - Responsive to some extent
  
Usage
--
    <div
        multi-select 
        input-model="input_list"          
        item-label="firstName lastName" 
        tick-property="selected"  
        output-model="output_list"
        orientation="vertical" 
        max-labels="4"
        is-disabled="multi_select_state" >
    </div>
    
        // or this one, but not really tested, so be careful with browser compatibility.

    <multi-select 
        ...
        ... >
    </multi-select> 

Attributes / Options
--
Below are the available attributes to configure the multi-select directive:

##### input-model (REQUIRED)
$scope variable. Array of objects. 
<br />Example:
<br />$scope.inputList = [    
&nbsp;&nbsp;&nbsp;&nbsp;{ id: 1, firstName: "Peter",    lastName: "Parker",     selected: false },
<br />&nbsp;&nbsp;&nbsp;&nbsp;{ id: 2, firstName: "Mary",     lastName: "Jane",       selected: false },
<br />&nbsp;&nbsp;&nbsp;&nbsp;{ id: 3, firstName: "Bruce",    lastName: "Wayne",      selected: true },
<br />&nbsp;&nbsp;&nbsp;&nbsp;{ id: 4, firstName: "David",    lastName: "Banner",     selected: false },
<br />&nbsp;&nbsp;&nbsp;&nbsp;{ id: 5, firstName: "Natalia",  lastName: "Romanova",   selected: false },
<br />&nbsp;&nbsp;&nbsp;&nbsp;{ id: 6, firstName: "Clark",    lastName: "Kent",       selected: true }      
];    
- **IMPORTANT**: This directive updates the $scope variable (input-model) directly, therefore you cannot use the same $scope variable for multiple multi-select directives. You need to copy the input variable to a new one and use it on the second multi-select, and so on.

##### item-label (REQUIRED)
input-model property that you want to display on the button & checkboxes. Separate multiple values by space. 
<br />Example: 
item-label="firstName lastName"          

##### tick-property (REQUIRED)
input-model property with a boolean value that represent the state of a checkbox. 
<br />For example: 
 - item-ticker is "selected"   
    - if selected === true, checkbox will be ticked. 
    - If selected === false, checkbox will not be ticked.
 - item-ticker is "isOn"       
   - if isOn === true, checkbox will be ticked. 
   - If isOn === false, checkbox will not be ticked.

##### output-model
A $scope variable. If specified, will list all the selected checkboxes model.

##### orientation ( "vertical" | "horizontal" )
Orientation of the list of checkboxes. If not specified, the default will be "vertical".

##### max-labels
Maximum number of items that will be displayed in the dropdown button. If not specified, will display all selected items. 
<br />Example: "1"
<br />- Using the input-model above, then button will display: "Bruce Wayne, ... [ Total: 2 ]"

##### is-disabled 
Expression to be evaluated. Will disable or enable the checkboxes. 
<br />If not specified, the default will be "false". 
<br />(Similar with ng-disabled, see http://docs.angularjs.org/api/ng/directive/ngDisabled)

Note
--
I use HTML entity 9662 for the caret (downward pointing arrow). If you want a better looking arrow, you can use the .caret class in the CSS file. Just create a span using that .caret. Do note that this span won't toggle the dropdown. You need to click outside the span.

Requirements
--
AngularJS v1.2.15 is used in the script.

Browser Compatibility
--
Tested on:
- Opera 12.16 (Yes, I love Opera browser! Download yours here: http://www.opera.com/)
- IE8 (IE8 is the default browser in the company I work for)
- Firefox 27
- Google Chrome 33

Licence
--
Released under the MIT license. 
