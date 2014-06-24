/* 
 * Angular JS Multi Select
 * Creates a dropdown-like button with checkboxes.
 *
 * Released under the MIT License
 *
 * --------------------------------------------------------------------------------
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Ignatius Steven (https://github.com/isteven)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions: 
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

angular.module('multi-select', ['ng']).directive('multiSelect', [ function () {
    return {
        restrict: 'AE',

        replace: true,

        scope: {
            inputModel: '=',
            outputModel: '=',
            buttonLabel: '@',
            selectionMode: '@',
            itemLabel: '@',
            tickProperty: '@',
            disableProperty: '@',
            orientation: '@',
            defaultLabel: '@',
            noLabel: '@',
            maxLabels: '@',
            isDisabled: '=',
            directiveId: '@',
            helperElements: '@',
            onOpen: '&',
            onClose: '&',
            onBlur: '&',
            onFocus: '&'
        },

        template: '<span class="multiSelect inlineBlock" >' +
            '<button type="button" class="multiSelect button multiSelectButton" ng-click="toggleCheckboxes( $event ); refreshSelectedItems();" ng-focus="onFocus()" ng-blur="onBlur()">' +
            '{{ varButtonLabel }}' +
            '<span class="multiSelect caret"></span>' +
            '</button>' +
            '<div class="multiSelect checkboxLayer hide">' +
            '<div class="multiSelect line" ng-show="displayHelper( \'all\' ) || displayHelper( \'none\' ) || displayHelper( \'reset\' )">' +
            '<span ng-if="!isDisabled && ( displayHelper( \'all\' ) || displayHelper( \'none\' ) || displayHelper( \'reset\' ))">Auswahl: &nbsp;</span>' +
            '<button type="button" ng-click="select( \'all\' )"    class="multiSelect helperButton" ng-if="!isDisabled && displayHelper( \'all\' )">All</button> ' +
            '<button type="button" ng-click="select( \'none\' )"   class="multiSelect helperButton" ng-if="!isDisabled && displayHelper( \'none\' )">None</button> ' +
            '<button type="button" ng-click="select( \'reset\' )"  class="multiSelect helperButton" ng-if="!isDisabled && displayHelper( \'reset\' )">Reset</button>' +
            '</div>' +
            '<div class="multiSelect line" ng-show="displayHelper( \'filter\' )">' +
            'Filter: <input class="multiSelect" type="text" ng-model="labelFilter" />' +
            '&nbsp;<button type="button" class="multiSelect helperButton" ng-click="labelFilter=\'\'">Clear</button>' +
            '</div>' +
            '<div ng-repeat="item in (inputModel | filter:labelFilter )" ng-class="orientation" class="multiSelect multiSelectItem">' +
            '<div class="multiSelect acol">' +
            '<div class="multiSelect" ng-show="item[ tickProperty ]">&#10004;</div>' +
            '</div>' +
            '<div class="multiSelect acol">' +
            '<label class="multiSelect" ng-class="{checkboxSelected:item[ tickProperty ]}">' +
            '<input class="multiSelect checkbox" type="checkbox" ng-disabled="itemIsDisabled( item )" ng-checked="item[ tickProperty ]" ng-click="syncItems( item, $event )"/>' +
            '<span class="multiSelect">{{ writeLabel(item, \'itemLabel\') }}</span>' +
            '</label>&nbsp;&nbsp;' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</span>',

        link: function ($scope, element, attrs) {
            var backUp = [];
            $scope.varButtonLabel = '';
            var scrolled = false;

            // Show or hide a helper element 
            $scope.displayHelper = function (elementString) {
                if (typeof attrs.helperElements === 'undefined') {
                    return true;
                }
                switch (elementString.toUpperCase()) {
                    case 'ALL':
                        if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {
                            return false;
                        }
                        else {
                            if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('ALL') >= 0) {
                                return true;
                            }
                        }
                        break;
                    case 'NONE':
                        if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {
                            return false;
                        }
                        else {
                            if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('NONE') >= 0) {
                                return true;
                            }
                        }
                        break;
                    case 'RESET':
                        if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('RESET') >= 0) {
                            return true;
                        }
                        break;
                    case 'FILTER':
                        if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('FILTER') >= 0) {
                            return true;
                        }
                        break;
                    default:
                        break;
                }
                return false;
            };

            // Call this function when a checkbox is ticked...
            $scope.syncItems = function (item, e) {
                var index = $scope.inputModel.indexOf(item);
                $scope.inputModel[ index ][ $scope.tickProperty ] = !$scope.inputModel[ index ][ $scope.tickProperty ];

                // If it's single selection mode
                if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {
                    $scope.inputModel[ index ][ $scope.tickProperty ] = true;
                    for (var i = 0; i < $scope.inputModel.length; i++) {
                        if (i !== index) {
                            $scope.inputModel[ i ][ $scope.tickProperty ] = false;
                        }
                    }
                    $scope.toggleCheckboxes(e);
                }

                $scope.refreshSelectedItems();
                e.target.focus();
            };
            
            var isSelected = function(value) {
            	return typeof value !== 'undefined' && (value[ $scope.tickProperty ] === true || value[ $scope.tickProperty ] === 'true');
            };

            // Refresh the button to display the selected items and push into output model if specified
            $scope.refreshSelectedItems = function () {

                $scope.varButtonLabel = '';
                var ctr = 0;

                var selectedItemCount = 0;
                angular.forEach($scope.inputModel, function (value) {
                    if (isSelected(value)) {
                    	selectedItemCount++;
                    }
                });

                // Push into output model
                if (typeof attrs.outputModel !== 'undefined') {
                	var tmpOutput = [];
                	angular.forEach($scope.inputModel, function (value) {
                        if (isSelected(value)) {
                        	tmpOutput.push(value);
                        }
                    });
                	$scope.outputModel = tmpOutput;
                }

                // Write label...
                if (!$scope.noLabel) {
                    if (selectedItemCount === 0) {
                        $scope.varButtonLabel = ($scope.defaultLabel) ? $scope.defaultLabel : 'None selected';
                    }
                    else {
                        var tempMaxLabels = selectedItemCount;
                        if (typeof $scope.maxLabels !== 'undefined' && $scope.maxLabels !== '') {
                            tempMaxLabels = $scope.maxLabels;
                        }

                        // If max amount of labels displayed..
                        $scope.more = selectedItemCount > tempMaxLabels;

                        angular.forEach($scope.inputModel, function (value) {
                        	if (isSelected(value)) {
                                if (ctr < tempMaxLabels) {
                                    $scope.varButtonLabel += ( $scope.varButtonLabel.length > 0 ? ', ' : '') + $scope.writeLabel(value, 'buttonLabel');
                                }
                                ctr++;
                            }
                        });

                        if ($scope.more === true) {
                            if (tempMaxLabels > 0) {
                                $scope.varButtonLabel += ', ... ';
                            }
                            $scope.varButtonLabel += '(Total: ' + selectedItemCount + ')';
                        }
                    }
                }
            };

            // Check if a checkbox is disabled or enabled. It will check the granular control (disableProperty) and global control (isDisabled)
            // Take note that the granular control has higher priority.
            $scope.itemIsDisabled = function (item) {
                if (item[ $scope.disableProperty ] === true) {
                    return true;
                } else {
                    return $scope.isDisabled;
                }
            };

            // A simple function to parse the item label settings
            $scope.writeLabel = function (item, type) {
                var label = '';
                var temp = $scope[type].split( ' ' );                    
                angular.forEach(temp, function (value2) {
                    if (typeof value2 !== 'undefined') {                        
                        angular.forEach(item, function (value1, key1) {                    
                            if (key1 == value2) {
                                label += ' ' + value1;        
                            }
                        });                    
                    }
                });
                return label;
            };

            // UI operations to show/hide checkboxes based on click event..
            $scope.toggleCheckboxes = function (e) {

                // Determine what element is clicked (has to be button). 
                if (e.target) {
                    if (e.target.tagName.toUpperCase() !== 'BUTTON' && e.target.className.indexOf('multiSelectButton') < 0) {
                        if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {
                            if (e.target.tagName.toUpperCase() === 'INPUT') {
                                e = $scope.findUpTag(e.target, 'div', 'checkboxLayer');
                                e = e.previousSibling;
                            }
                        }
                        else {
                            e = $scope.findUpTag(e.target, 'button', 'multiSelectButton');
                        }
                    }
                    else {
                        e = e.target;
                    }
                }

                $scope.labelFilter = '';

                // Search all the multi-select instances based on the class names
                var multiSelectIndex = -1;
                var checkboxes = document.querySelectorAll('.checkboxLayer');
                var multiSelectButtons = document.querySelectorAll('.multiSelectButton');

                // Mark which instance is clicked
                for (var i = 0; i < multiSelectButtons.length; i++) {
                    if (e === multiSelectButtons[ i ]) {
                        multiSelectIndex = i;
                        break;
                    }
                }

                // Apply the hide css to all multi-select instances except the clicked one
                if (multiSelectIndex > -1) {
                    for (i = 0; i < checkboxes.length; i++) {
                        if (i != multiSelectIndex) {
                            checkboxes[i].className = 'multiSelect checkboxLayer hide';
                        }
                    }

                    // If it's already hidden, show it
                    if (checkboxes[ multiSelectIndex ].className == 'multiSelect checkboxLayer hide') {
                        checkboxes[ multiSelectIndex ].className = 'multiSelect checkboxLayer show';
                        // https://github.com/isteven/angular-multi-select/pull/5 - On open callback
                        $scope.onOpen();
                    }

                    // If it's already displayed, hide it
                    else if (checkboxes[ multiSelectIndex ].className == 'multiSelect checkboxLayer show') {
                        checkboxes[ multiSelectIndex ].className = 'multiSelect checkboxLayer hide';
                        // https://github.com/isteven/angular-multi-select/pull/5 - On close callback
                        $scope.onClose();
                    }
                }
            };

            // Traverse up to find the button tag
            // http://stackoverflow.com/questions/7332179/how-to-recursively-search-all-parentnodes
            $scope.findUpTag = function (el, tag, className) {

                while (el.parentNode) {
                    el = el.parentNode;
                    if (typeof el.tagName !== 'undefined') {
                        if (el.tagName.toUpperCase() === tag.toUpperCase() && el.className.indexOf(className) > -1) {
                            return el;
                        }
                    }
                }
                return null;
            };

            // Select All / None / Reset
            $scope.select = function (type) {
                switch (type.toUpperCase()) {
                    case 'ALL':
                        angular.forEach($scope.inputModel, function (value) {
                            if (typeof value !== 'undefined' && value[ $scope.disableProperty ] !== true) {
                                value[ $scope.tickProperty ] = true;
                            }
                        });
                        break;
                    case 'NONE':
                        angular.forEach($scope.inputModel, function (value) {
                            if (typeof value !== 'undefined' && value[ $scope.disableProperty ] !== true) {
                                value[ $scope.tickProperty ] = false;
                            }
                        });
                        break;
                    case 'RESET':
                    	if (backUp.length === $scope.inputModel.length) {
                    		for (var i = 0; i < $scope.inputModel.length; i++) {
                    			$scope.inputModel[i][$scope.tickProperty] = backUp[i];
                    		}
                    	}
                        break;
                    default:
                }
                $scope.refreshSelectedItems();
            };


            // Generic validation for required attributes
            // Might give false positives so just ignore if everything's alright.
            var validate = function () {
                if (!( 'inputModel' in attrs )) {
                    console.log('Multi-select error: input-model is not defined! (ID: ' + $scope.directiveId + ')');
                }

                if (!( 'buttonLabel' in attrs )) {
                    console.log('Multi-select error: button-label is not defined! (ID: ' + $scope.directiveId + ')');
                }

                if (!( 'itemLabel' in attrs )) {
                    console.log('Multi-select error: item-label is not defined! (ID: ' + $scope.directiveId + ')');
                }

                if (!( 'tickProperty' in attrs )) {
                    console.log('Multi-select error: tick-property is not defined! (ID: ' + $scope.directiveId + ')');
                }
            };

            // Validate whether the properties specified in the directive attributes are present in the input model
            var validateProperties = function (arrProperties, arrObject) {
                var notThere = false;
                var missingLabel = '';
                angular.forEach(arrProperties, function (value1) {
                    if (typeof value1 !== 'undefined') {
                        var keepGoing = true;
                        angular.forEach(arrObject, function (value2) {
                            if (typeof value2 !== 'undefined' && keepGoing) {
                                if (!( value1 in value2 )) {
                                    notThere = true;
                                    keepGoing = false;
                                    missingLabel = value1;
                                }
                            }
                        });
                    }
                });
                if (notThere === true) {
                    console.log('Multi-select error: property "' + missingLabel + '" is not available in the input model. (Name: ' + $scope.directiveId + ')');
                }
            };

            ///////////////////////
            // Logic starts here
            ///////////////////////               

            validate();
            $scope.refreshSelectedItems();

            // Watch for changes in input model 
            // Updates multi-select when user select/deselect a single checkbox programatically
            // https://github.com/isteven/angular-multi-select/issues/8
            $scope.$watch('inputModel', function (oldVal, newVal) {
                if (newVal !== 'undefined') {
                    validateProperties($scope.itemLabel.split(' '), $scope.inputModel);
                    validateProperties(new Array($scope.tickProperty), $scope.inputModel);
                }
                $scope.refreshSelectedItems();
            }, true);

            // Watch for changes in input model 
            // This on updates the multi-select when a user load a whole new input-model. We also update the backUp variable
            $scope.$watch('inputModel', function (oldVal, newVal) {
                if (newVal !== 'undefined') {
                    validateProperties($scope.itemLabel.split(' '), $scope.inputModel);
                    validateProperties(new Array($scope.tickProperty), $scope.inputModel);
                }
                backUp = [];
                if ($scope.inputModel) {
	                for (var i = 0; i < $scope.inputModel.length; i++) {
	                	backUp.push($scope.inputModel[i][$scope.tickProperty]);
	        		}
                }
                $scope.refreshSelectedItems();
            });

            // This is for touch enabled devices. We don't want to hide checkboxes on scroll. 
            angular.element(document).bind('touchstart.multiSelect', function () {
                $scope.$apply(function () {
                    scrolled = false;
                });
            });

            angular.element(document).bind('touchmove.multiSelect', function () {
                $scope.$apply(function () {
                   scrolled = true;
                });
            });
            
            var onClickFn = function (e) {
                if (e.type === 'click' || e.type === 'touchend' && scrolled === false) {
                    var checkboxes = document.querySelectorAll('.checkboxLayer');
                    if (e.target.className.indexOf === undefined || e.target.className.indexOf('multiSelect')) {
                        for (var i = 0; i < checkboxes.length; i++) {
                            checkboxes[i].className = 'multiSelect checkboxLayer hide';
                        }
                        e.stopPropagation();
                    }
                }
            };

            // Monitor for click or touches outside the button element to hide the checkboxes
            angular.element(document).bind('click.multiSelect', onClickFn);
            angular.element(document).bind('touchend.multiSelect', onClickFn);
            
            element.on('$destroy', function() {
            	// It is important to unbind the handlers to clean all references to the currently loaded data.
              // Otherwise one creates a memory leak.
            	angular.element(document).unbind('click.multiSelect');
            	angular.element(document).unbind('touchend.multiSelect');
            	angular.element(document).unbind('touchstart.multiSelect');
            	angular.element(document).unbind('touchmove.multiSelect');
            });
        }
    };
}]);

