Angular Multi Select
====================
Angular Multi Select is a directive which will create a dropdown button with multiple checkboxes.

Features
--
  - Reset checkbox selections to original state
  - Dynamically update the input model
  - Configurable, such as:
    - Set model property to bind to the checkbox status
    - Set orientation of checkboxes
    - Enable / disable checkboxes
    - Set maximum number of items to be displayed on the button label
    - Maximum height of checkbox layer in pixels (will show scrollbar on overflow)
  - Utilizes angularjs filter
  - Responsive to some extent
  
Usage
--
    <div
        multi-select 
        input-model="input_list"          
        item-label="firstName lastName" 
        item-ticker="selected"  
        output-model="output_list"
        orientation="vertical" 
        max-labels="4"
        max-height="500"
        is-disabled="multi_select_state" >
    </div>
    
        // or
 
    <multi-select 
        ...
        ...
    </multi-select> 
        // ( not really tested, so be careful with browser compatibility)

Attributes / Options
--
Below are the available attributes to configure the multi-select directive:

- #### input-model (REQUIRED)
$scope variable. Array of objects. 
<br />Example:
      $scope.inputList = [    
        <br />{ id: 1, firstName: "Peter",    lastName: "Parker",     selected: false },
        <br />{ id: 2, firstName: "Mary",     lastName: "Jane",       selected: false },
        <br />{ id: 3, firstName: "Bruce",    lastName: "Wayne",      selected: true },
        <br />{ id: 4, firstName: "David",    lastName: "Banner",     selected: false },
        <br />{ id: 5, firstName: "Natalia",  lastName: "Romanova",   selected: false },
        <br />{ id: 6, firstName: "Clark",    lastName: "Kent",       selected: true },      
    ];    

- #### item-label (REQUIRED)
input-model property that you want to display on the button & checkboxes. Separate multiple values by space. 
<br />Example: 
item-label="firstName lastName"          


- #### item-ticker (IMPORTANT):
input-model property with a boolean value that represent the state of a checkbox. 
<br />For example: 
 - item-ticker is "selected"   
   - if selected === true, checkbox will be ticked. 
<br />If selected === false, checkbox will not be ticked.
 - item-ticker is "isOn"       
   - if isOn === true, checkbox will be ticked. 
<br />If isOn === false, checkbox will not be ticked.

 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If not specified, the default will be "selected"

- #### output-model:
A $scope variable. If specified, will list all the selected checkboxes model.

- #### orientation ( "vertical" | "horizontal" )
Orientation of the list of checkboxes. If not specified, the default will be "vertical".

- #### max-labels
Maximum number of items that will be displayed in the dropdown button. If not specified, will display all selected items. 
<br />Example: "2"
<br />Using the input-model above, then button will display the first two selected items: "Mary Jane, Luke Skywalker, ..."

- #### max-height
Maximum height of the list of checkboxes in pixels. Will show scrollbar on overflow.
<br />Example: "100". 

- #### is-disabled 
Expression to be evaluated. Will disable or enable the checkboxes. 
<br />If not specified, the default will be "false". 
<br />(Similar with ng-disabled, see http://docs.angularjs.org/api/ng/directive/ngDisabled)

Example
--
Download all the files into a same folder and open multiselect.htm

Licence
--
Released under the MIT license. 



 
  



