/* 
 * Ignatius Steven 
 * Created: Tue, 14 Jan 2014 - 5:18:02 PM
 * Last update: Wed, 26 Mar 2014 - 11:12:29 AM
 * 
 * Angular JS Multi Select
 * Creates a dropdown-like button with checkboxes. 
 * Accepts an array of objects & modifies the checkbox status.
 *
 * --------------------------------------------------------------------------------
 * MIT License
 *
 * Copyright (C) 2014 Ignatius Steven (ignatius.steven@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
 * the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions: The above copyright notice and this 
 * permission notice shall be included in all copies or substantial portions of 
 * the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 * --------------------------------------------------------------------------------
 *
 * Usage:
 *
 *      <div
 *          multi-select 
 *          input-model="input_list"          
 *          item-label="firstName lastName" 
 *          item-ticker="selected"  
 *          output-model="output_list"
 *          orientation="vertical" 
 *          max-labels="4"
 *          max-height="500"
 *          is-disabled="multi-select-state" >
 *      </div>
 *   
 *   or
 *
 *      <multi-select 
 *          ...
 *          ...
 *      </multi-select> 
 *          (*** be careful with browser compatibility)
 *
 * Attributes: 
 *
 *      input-model (! REQUIRED !):
 *          $scope variable. Array of objects such as
 *          [
 *              { firstName: "John", lastName: "Robert"     , ....., selected: false },
 *              { firstName: "Jane", lastName: "Angel"      , ....., selected: true },
 *              { firstName: "Luke", lastName: "Skywalker"  , ....., selected: true },
 *              { firstName: "John", lastName: "Wayne"      , ....., selected: true }
 *          ]    
 *
 *      item-label (String) (! REQUIRED !) 
 *          The object property that you want to display on the button & checkboxes. Separate multiple values by space. 
 *          Example: item-label="firstName lastName"          
 *
 *      item-ticker (String) (! IMPORTANT !):
 *          Column name with a boolean value that represent the state of a checkbox. 
 *          For example: 
 *              item-ticker is "selected"   -> if selected === true, checkbox will be ticked. If selected === false, checkbox will not be ticked.
 *              item-ticker is "isOn"       -> if isOn === true, checkbox will be ticked. If isOn === false, checkbox will not be ticked.
 *          If not specified, the default will be "selected"
 *
 *      output-model:
 *          $scope variable.
 *          If specified, will list all the selected checkboxes model ( eg. input-model.selected === true ).
 *
 *      orientation (String - "vertical" | "horizontal")
 *          Orientation of the list of checkboxes. 
 *          If not specified, the default will be "vertical".
 *
 *      max-labels (String)
 *          Maximum number of items that will be displayed in the dropdown button. If not specified, will display all selected items. 
 *          Example: "2" -> Using the input-model above, then button will display the first two selected: "Jane Angel, Luke Skywalker, ..."
 *
 *      max-height (String)
 *          Maximum height of the list of checkboxes in pixels. Will show scrollbar on overflow.
 *          Example: "100". 
 *
 *      is-disabled (Expression (similar with ng-disabled, see ) 
 *          Disable or enable the checkboxes. 
 *          If not specified, the default will be "false". 
 *
 */

angular.module( 'multi-select', ['ng'] ).directive( 'multiSelect' , [ '$timeout', '$compile' , function ( $timeout, $compile ) {
    return {
        restrict: 
            'AE',

        replace: 
            true,

        scope: 
        {
            inputModel  : '=',
            outputModel : '=',
            itemLabel   : '@',
            itemTicker  : '@',
            orientation : '@',
            maxLabels   : '@',
            maxHeight   : '@',
            isDisabled  : '='
        },

        template: 
            '<span class="multiSelect inlineBlock">' +
                '<button type="button" class="multiSelect button multiSelectButton" ng-click="toggleCheckboxes( $event ); refreshSelectedItems();">' +                                         
                    '<div ng-if="selectedItems.length <= 0">None selected</div>' +                    
                    '<div ng-if="selectedItems.length > 0" ng-repeat="item in selectedItems | limitTo: varMaxLabels">' + 
                        '<span ng-if="$index > 0">, </span>{{writeLabel( item )}}' + 
                    '</div>' +
                    '<span ng-if="more">, ... [ Selected: {{selectedItems.length}} ]</span><span class="caret"></span>' +                                        
                '</button>' +                
                '<div class="multiSelect checkboxLayer hide" style="{{layerStyle}}">' +
                    '<div class="multiSelect line">' +
                        'Select: &nbsp;&nbsp;' + 
                            '<a ng-click="select( \'all\' )"    class="multiSelect" >All</a> / ' +
                            '<a ng-click="select( \'none\' )"   class="multiSelect" >None</a> / ' + 
                            '<a ng-click="select( \'reset\' )"  class="multiSelect" >Reset</a>' +
                    '</div>' +
                    '<div class="multiSelect line">' + 
                        'Filter: <input class="multiSelect" type="text" ng-model="labelFilter" />' +
                            '<a class="multiSelect" ng-click="labelFilter=\'\'">Clear</a>' +
                    '</div>' +
                    '<div ng-repeat="item in inputModel | filter:labelFilter" ng-class="orientation" class="multiSelect">' +
                        '<label class="multiSelect" ng-class="{checkboxSelected:item[ itemSelector ]}">' +
                            '<input class="multiSelect" type="checkbox" ng-disabled="isDisabled" ng-checked="item[ itemSelector ]" ng-click="syncItems( item )" />' +
                                '{{writeLabel( item )}}' +
                        '</label>&nbsp;&nbsp;' +
                    '</div>' +
                '</div>' +
            '</span>',

        link: function ( $scope, element, attrs ) {      
            
            $scope.selectedItems    = [];    
            $scope.backUp           = [];
            $scope.layerStyle       = '';
            $scope.varMaxLabels     = 0;    

            // Checkbox is ticked
            $scope.syncItems = function( item ) {                                  
                item[ $scope.itemSelector ] = !item[ $scope.itemSelector ];                                
                $scope.refreshSelectedItems();                   
            }     

            // Refresh the button to display the selected items and push into output model if specified
            $scope.refreshSelectedItems = function() {
                $scope.selectedItems = [];
                angular.forEach( $scope.inputModel, function( value, key ) {
                    if ( value[ $scope.itemSelector ] === true || value[ $scope.itemSelector ] === 'true' ) {
                        $scope.selectedItems.push( value );                        
                    }
                });
                
                // Push into output model
                if ( typeof attrs.outputModel !== 'undefined' ) {            
                    $scope.outputModel = angular.copy( $scope.selectedItems );                    
                }                                

                // If max amount of labels displayed..
                if ( $scope.selectedItems.length > $scope.maxLabels ) {
                    $scope.more = true;
                }
                else {
                    $scope.more = false;
                }
                if ( typeof $scope.maxLabels === 'undefined' ) {                
                    $scope.varMaxLabels = $scope.selectedItems.length;
                }
                else {
                    $scope.varMaxLabels = $scope.maxLabels;
                }                         
            }

            // UI operations to show/hide checkboxes
            $scope.toggleCheckboxes = function( e ) {

                $scope.labelFilter = '';
              
                var multiSelectIndex    = -1;                
                var checkboxes          = document.querySelectorAll( '.checkboxLayer' );
                var multiSelectButtons  = document.querySelectorAll( '.multiSelectButton' );   

                for( i=0; i < multiSelectButtons.length; i++ ) {
                    if ( e.target == multiSelectButtons[ i ] ) {
                        multiSelectIndex = i;
                        break;
                    }
                }                

                for( i=0; i < checkboxes.length; i++ ) {
                    if ( i != multiSelectIndex ) {
                        checkboxes[i].className = 'multiSelect checkboxLayer hide';
                    }
                }

                if ( checkboxes[ multiSelectIndex ].className == 'multiSelect checkboxLayer hide' ) {                    
                    checkboxes[ multiSelectIndex ].className = 'multiSelect checkboxLayer show';
                }
                else if ( checkboxes[ multiSelectIndex ].className == 'multiSelect checkboxLayer show' ) {                                    
                    checkboxes[ multiSelectIndex ].className = 'multiSelect checkboxLayer hide';
                }                
            }

            // Select All / None / Reset
            $scope.select = function( type ) {
                switch( type.toUpperCase() ) {
                    case 'ALL':
                        angular.forEach( $scope.inputModel, function( value, key ) {
                            value[ $scope.itemSelector ] = true;
                        });                
                        break;
                    case 'NONE':
                        angular.forEach( $scope.inputModel, function( value, key ) {
                            value[ $scope.itemSelector ] = false;
                        });                
                        break;      
                    case 'RESET':
                        $scope.inputModel = angular.copy( $scope.backUp );                        
                        break;
                    default:                        
                }
                $scope.refreshSelectedItems();
            }

            // What's written on the button
            $scope.writeLabel= function( item ) {
                var label = '';
                angular.forEach( item, function( value1, key1 ) {
                    var temp = $scope.itemLabel.split( ' ' );
                    angular.forEach( temp, function( value2, key2 ) {
                        if ( key1 == value2 ) {
                            label += ' ' + value1;        
                        }
                    });                    
                });
                return label;
            }

            /////////////////////
            // Logic starts here
            /////////////////////
            $scope.itemSelector = ( typeof $scope.itemTicker === 'string' ? $scope.itemTicker : 'selected' );
            $scope.refreshSelectedItems();                                                          

            // Watch for changes in input model (allow dynamic input)
            $scope.$watch( 'inputModel' , function( newVal ) { 
                $scope.refreshSelectedItems();                                                                                              
                $scope.backUp = angular.copy( $scope.inputModel );                
            });

            // Watch for changes in directive state (disabled or enabled)
            $scope.$watch( 'isDisabled' , function( newVal ) {         
                $scope.isDisabled = newVal;                               
            });

            // Checkbox height
            if ( typeof $scope.maxHeight !== 'undefined' ) { 
                $scope.layerStyle = 'max-height:' + $scope.maxHeight + 'px; overflow: auto; min-width: auto';
            }  

            // Monitor for clicks outside the button element to hide the checkboxes
            angular.element( document ).bind( 'click' , function( e ) {                                
                var checkboxes = document.querySelectorAll( '.checkboxLayer' );     
                if ( e.target.className.indexOf( 'multiSelect' ) === -1 ) {
                    for( i=0; i < checkboxes.length; i++ ) {                                        
                        checkboxes[i].className = 'multiSelect checkboxLayer hide';                        
                    }
                    $scope.$apply();                    
                    e.stopPropagation();
                }                                
            });            
        }   
    }
}]);

