/* 
 * Created: Tue, 14 Jan 2014 - 5:18:02 PM
 * 
 * Angular JS Multi Select
 * Creates a dropdown-like button with checkboxes. 
 *
 * Released under MIT License
 * --------------------------------------------------------------------------------
 * MIT License
 *
 * Copyright (C) 2014 Ignatius Steven
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in 
 * the Software without restriction, including without limitation the rights to 
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
 * the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions: 
 *
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 * --------------------------------------------------------------------------------
 */

angular.module( 'multi-select', ['ng'] ).directive( 'multiSelect' , [ '$timeout', '$compile' , function ( $timeout, $compile ) {
    return {
        restrict: 
            'AE',

        replace: 
            true,

        scope: 
        {
            inputModel      : '=',
            outputModel     : '=',
            itemLabel       : '@',
            tickProperty    : '@',
            orientation     : '@',
            maxLabels       : '@',
            isDisabled      : '='
        },

        template: 
            '<span class="multiSelect inlineBlock">' +
                '<div class="multiSelect button multiSelectButton" ng-click="toggleCheckboxes( $event ); refreshSelectedItems();">' +                                         
                    '{{buttonLabel}}' + 
                    ' &nbsp;&#9662;' +
                '</div>' +                
                '<div class="multiSelect checkboxLayer hide" style="{{layerStyle}}">' +
                    '<div class="multiSelect line">' +
                        '<span ng-if="!isDisabled">Select: &nbsp;&nbsp;</span>' + 
                            '<button type="button" ng-click="select( \'all\' )"    class="multiSelect helperButton" ng-if="!isDisabled">All</button> ' +
                            '<button type="button" ng-click="select( \'none\' )"   class="multiSelect helperButton" ng-if="!isDisabled">None</button> ' + 
                            '<button type="button" ng-click="select( \'reset\' )"  class="multiSelect helperButton" ng-if="!isDisabled">Reset</button>' +
                    '</div>' +
                    '<div class="multiSelect line">' + 
                        'Filter: <input class="multiSelect" type="text" ng-model="labelFilter" />' +
                            '<button type="button" class="multiSelect helperButton" ng-click="labelFilter=\'\'">Clear</button>' +
                    '</div>' +
                    '<div ng-repeat="item in inputModel | filter:labelFilter" ng-class="orientation" class="multiSelect multiSelectItem">' +
                        '<label class="multiSelect" ng-class="{checkboxSelected:item[ tickProperty ]}">' +
                            '<input class="multiSelect" type="checkbox" ng-disabled="isDisabled" ng-checked="item[ tickProperty ]" ng-click="syncItems( item )" />' +
                                '{{writeLabel( item )}}' +
                        '</label>&nbsp;&nbsp;' +
                    '</div>' +
                '</div>' +
            '</span>',

        link: function ( $scope, element, attrs ) {      
            
            $scope.selectedItems    = [];    
            $scope.backUp           = [];
            $scope.layerStyle       = '';
            $scope.buttonLabel      = '';            

            // Checkbox is ticked
            $scope.syncItems = function( item ) {                                                                
                index = $scope.inputModel.indexOf( item );                
                $scope.inputModel[ index ][ $scope.tickProperty ] = !$scope.inputModel[ index ][ $scope.tickProperty ];
                $scope.refreshSelectedItems();                   
            }     

            // Refresh the button to display the selected items and push into output model if specified
            $scope.refreshSelectedItems = function() {

                $scope.buttonLabel      = '';
                $scope.selectedItems    = [];
                ctr                     = 0;
                
                angular.forEach( $scope.inputModel, function( value, key ) {
                    if ( typeof value !== 'undefined' ) {                        
                        if ( value[ $scope.tickProperty ] === true || value[ $scope.tickProperty ] === 'true' ) {
                            $scope.selectedItems.push( value );        
                        }
                    }
                });
                                           
                // Push into output model
                if ( typeof attrs.outputModel !== 'undefined' ) {            
                    $scope.outputModel = angular.copy( $scope.selectedItems );                    
                }                                

                // Write label...
                if ( $scope.selectedItems.length === 0 ) {
                    $scope.buttonLabel = 'None selected';
                }
                else {                
                    var tempMaxLabels = $scope.selectedItems.length;
                    if ( typeof $scope.maxLabels !== 'undefined' && $scope.maxLabels !== '' && $scope.maxLabels !== "0" ) {
                        tempMaxLabels = $scope.maxLabels;
                    }

                    // If max amount of labels displayed..
                    if ( $scope.selectedItems.length > tempMaxLabels ) {
                        $scope.more = true;
                    }
                    else {
                        $scope.more = false;
                    }                
                
                    angular.forEach( $scope.selectedItems, function( value, key ) {
                        if ( typeof value !== 'undefined' ) {                        
                            if ( ctr < tempMaxLabels ) {                            
                                $scope.buttonLabel += ( $scope.buttonLabel.length > 0 ? ', ' : '') + $scope.writeLabel( value );
                            }
                            ctr++;
                        }
                    });                

                    if ( $scope.more === true ) {
                        $scope.buttonLabel += ', ... (Total: ' + $scope.selectedItems.length + ')';
                    }
                }
            }

            // A simple function to parse the item label settings
            $scope.writeLabel = function( item ) {
                var label = '';
                var temp = $scope.itemLabel.split( ' ' );                    
                angular.forEach( temp, function( value2, key2 ) {
                    if ( typeof value2 !== 'undefined' ) {                        
                        angular.forEach( item, function( value1, key1 ) {                    
                            if ( key1 == value2 ) {
                                label += ' ' + value1;        
                            }
                        });                    
                    }
                });
                return label;
            }

            // UI operations to show/hide checkboxes
            $scope.toggleCheckboxes = function( e ) {

                $scope.labelFilter = '';                
              
                // We search them based on the class names
                var multiSelectIndex    = -1;                                
                var checkboxes          = document.querySelectorAll( '.checkboxLayer' );
                var multiSelectButtons  = document.querySelectorAll( '.multiSelectButton' );   

                for( i=0; i < multiSelectButtons.length; i++ ) {
                    if ( e.target === multiSelectButtons[ i ] ) {                        
                        multiSelectIndex = i;
                        break;
                    }
                }                                

                if ( multiSelectIndex > -1 ) {
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
            }

            // Select All / None / Reset
            $scope.select = function( type ) {
                switch( type.toUpperCase() ) {
                    case 'ALL':
                        angular.forEach( $scope.inputModel, function( value, key ) {
                            if ( typeof value !== 'undefined' ) {                        
                                value[ $scope.tickProperty ] = true;
                            }
                        });                                        
                        break;
                    case 'NONE':
                        angular.forEach( $scope.inputModel, function( value, key ) {
                            if ( typeof value !== 'undefined' ) {                        
                                value[ $scope.tickProperty ] = false;
                            }
                        });                
                        break;      
                    case 'RESET':
                        $scope.inputModel = angular.copy( $scope.backUp );                        
                        break;
                    default:                        
                }
                $scope.refreshSelectedItems();
            }            


            // Generic validation for required attributes
            validate = function() {
                if ( typeof $scope.inputModel === 'undefined' ) {
                    alert( 'multi-select ERROR - input model is not defined!' );
                }

                if ( typeof $scope.itemLabel === 'undefined' ) {
                    alert( 'multi-select ERROR - item label is not defined!' );                
                }            

                if ( typeof $scope.tickProperty === 'undefined' ) {
                    alert( 'multi-select ERROR - tick property is not defined!' );                
                }
            
                validateProperties( $scope.itemLabel.split( ' ' ), $scope.inputModel );
                validateProperties( new Array( $scope.tickProperty ), $scope.inputModel );
            }

            // Validate whether the properties specified in the directive attributes are present in the input model
            validateProperties = function( arrProperties, arrObject ) {
                var notThere = false;            
                var missingProperty = '';
                angular.forEach( arrProperties, function( value1, key1 ) {
                    if ( typeof value1 !== 'undefined' ) {                        
                        var keepGoing = true;
                        angular.forEach( arrObject, function( value2, key2 ) {
                            if ( typeof value2 !== 'undefined' && keepGoing ) {                        
                                if (!( value1 in value2 )) {
                                    notThere = true;
                                    keepGoing = false;
                                    missingLabel = value1;
                                }
                            }
                        });                    
                    }
                });    
                if ( notThere === true ) {
                    alert( 'multi-select ERROR:\n\nProperty "' + missingLabel + '" is not available in the input model.' );
                }
                
            }

            /////////////////////
            // Logic starts here
            /////////////////////
                    
            validate();

            $scope.refreshSelectedItems();                                                          

            // Watch for changes in input model (allow dynamic input)
            $scope.$watch( 'inputModel' , function( oldVal, newVal ) {                 
                validate();
                $scope.backUp = angular.copy( $scope.inputModel );                                                    
                $scope.refreshSelectedItems();                                                 
            });

            // Watch for changes in directive state (disabled or enabled)
            $scope.$watch( 'isDisabled' , function( newVal ) {         
                $scope.isDisabled = newVal;                               
            });

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
            
            // For IE8, perhaps. Not sure if this is really executed.
            if ( !Array.prototype.indexOf ) {
                Array.prototype.indexOf = function(what, i) {                    
                    i = i || 0;
                    var L = this.length;
                    while (i < L) {
                        if(this[i] === what) return i;
                        ++i;
                    }
                    return -1;
                };
            }
        }   
    }
}]);

