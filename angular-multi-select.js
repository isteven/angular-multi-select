/*
 * Angular JS Multi Select
 * Creates a dropdown-like button with checkboxes.
 *
 * Project started on: Tue, 14 Jan 2014 - 5:18:02 PM
 * Current version: 2.0.1
 *
 * Released under the MIT License
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

angular.module('multi-select', ['ng']).directive('multiSelect', [ '$sce', '$timeout', function($sce, $timeout) {
  return {
    restrict: 'AE',

    replace: true,

    scope: {
      // models
      inputModel: '=',
      outputModel: '=',

      // settings based on attribute
      buttonLabel: '@',
      defaultLabel: '@',
      selectedLabelRenderer: '@',
      directiveId: '@',
      helperElements: '@',
      isDisabled: '=',
      itemLabel: '@',
      displayClasses: '@',
      maxLabels: '@',
      orientation: '@',
      selectionMode: '@',
      searchKey: '@',
      disableDone: '@',
      clearButtonText: '@',

      // settings based on input model property
      tickProperty: '@',
      disableProperty: '@',
      groupProperty: '@',
      maxHeight: '@',
      maxSelectedItems: '=',
      shallowCopy: '@',

      // callbacks
      onClose: '&',
      onItemClick: '&',
      onSelectAllClick: '&',
      onOpen: '&'
    },

    template: '<span class="multiSelect inlineBlock">' +
    '<button type="button" class="button multiSelectButton" ng-click="::toggleCheckboxes( $event ); refreshSelectedItems(); refreshButton();" ng-bind-html="varButtonLabel">' +
    '</button>' +
    '<div class="checkboxLayer">' +
    '<form>' +
    '<div class="helperContainer" ng-show="displayHelper( \'filter\' ) || displayHelper( \'all\' ) || displayHelper( \'none\' ) || displayHelper( \'reset\' )">' +
    '<div class="line" ng-show="displayHelper( \'all\' ) || displayHelper( \'none\' ) || displayHelper( \'reset\' )">' +
    '<button type="button" ng-click="::select( \'all\',   $event );"    class="helperButton" ng-show="!isDisabled && displayHelper( \'all\' )">   &#10003;&nbsp; Select All</button> ' +
    '<button type="button" ng-click="::select( \'none\',  $event );"   class="helperButton" ng-show="!isDisabled && displayHelper( \'none\' )">  &times;&nbsp; {{clearButtonText}}</button>' +
    '<button type="button" ng-click="::select( \'reset\', $event );"  class="helperButton" ng-show="!isDisabled && displayHelper( \'reset\' )" style="float:right">&#8630;&nbsp; Reset</button>' +
    '<button type="button" ng-click="::select( \'done\',  $event );"   class="helperButton helperButtonDone" ng-show="!isDisabled && displayHelper( \'done\' )" style="float:right">&nbsp;&nbsp;Done&nbsp;&nbsp;</button>' +
    '</div>' +
    '<div class="line" style="position:relative" ng-show="::displayHelper( \'filter\' )">' +
    '<input placeholder="Search..." type="text" ng-click="::select( \'filter\', $event )" data-ng-model-options="{debounce: 300}" ng-model="inputLabel.labelFilter" ng-change="::throttledUpdateFilter();$scope.getFormElements();" class="inputFilter" />' +
    '<button type="button" class="clearButton" ng-click="::inputLabel.labelFilter=\'\';updateFilter();prepareGrouping();prepareIndex();select( \'clear\', $event )">&times;</button> ' +
    '</div>' +
    '</div>' +
    '<div class="checkBoxContainer" data-subfilter="::filteredModel" ng-style="{\'max-height\':setHeight()}" style="overflow-y:scroll">' +
    '<div ng-repeat="item in subFilteredModel track by $index  | filter:removeGroupEndMarker" class="multiSelectItem"' +
    'ng-class="{selected: item[ tickProperty ], horizontal: orientationH, vertical: orientationV, multiSelectGroup:item[ groupProperty ], disabled:itemIsDisabled( item )}"' +
    'ng-click="::syncItems( item, $event, $index );"' +
    'ng-mouseleave="::removeFocusStyle( tabIndex );"' +
    'style="position:absolute;top:0;transform:translate(0,{{item.displayIndex*31}}px);-webkit-transform:translate(0,{{item.displayIndex*31}}px);" ng-style="{\'-ms-transform\':transformFixIE(item.displayIndex)}">' +
    '<div class="acol" ng-show="item[ spacingProperty ] > 0" ng-repeat="i in numberToArray( item[ spacingProperty ] ) track by $index">&nbsp;</div>' +
    '<div class="acol">' +
    '<label>' +
    '<input class="checkbox focusable" type="checkbox" ng-disabled="itemIsDisabled( item )" ng-checked="item[ tickProperty ]" ng-click="::syncItems( item, $event, $index )" />' +
    '<span ng-class="{disabled:itemIsDisabled( item )}" ng-bind-html="::writeLabel( item, \'itemLabel\' )"></span>' +
    '</label>' +
    '</div>' +
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<span class="tickMark" ng-show="item[ groupProperty ] !== true && item[ tickProperty ] === true">&#10004;</span>' +
    '</div>' +
    '</div>' +
    '</form>' +
    '</div>' +
    '</span>',

    link: function($scope, element, attrs) {

      $scope.$on('$destroy', function() {
        $scope.$emit('multiSelectChange');
      });

      $scope.backUp = [];
      $scope.varButtonLabel = '';
      $scope.scrolled = false;
      $scope.spacingProperty = '';
      $scope.indexProperty = '';
      $scope.checkBoxLayer = '';
      $scope.orientationH = false;
      $scope.orientationV = true;
      $scope.filteredModel = [];
      $scope.inputLabel = { labelFilter: '' };
      $scope.selectedItems = [];
      $scope.formElements = [];
      $scope.tabIndex = 0;
      $scope.clickedItem = null;
      $scope.deepCopyDisabled = (attrs.shallowCopy === 'true');
      var prevTabIndex = 0;
      var helperItems = [];
      var helperItemsLength = 0;
      $scope.clearButtonText = $scope.clearButtonText || 'Select None';

      //$scope.inputModel = $scope.$eval(attrs.inputModel);
      function throttle(fn, threshhold, scope) {
        threshhold = threshhold || 250;
        var last;
        var deferTimer;

        return function() {
          var context = scope || this;

          var now = Number(new Date());
          var args = arguments;
          if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
              last = now;
              fn.apply(context, args);
            }, threshhold);
          } else {
            last = now;
            fn.apply(context, args);
          }
        };
      }

      $scope.transformFixIE = function(displayIndex) {
        return 'translate(0,' + (displayIndex * 31) + 'px)';
      };

      // If user specify a height, call this function
      $scope.setHeight = function() {
        if (typeof $scope.maxHeight !== 'undefined') {
          return $scope.maxHeight;
        }
      };

      // A little hack so that AngularJS ng-repeat can loop using start and end index like a normal loop
      // http://stackoverflow.com/questions/16824853/way-to-ng-repeat-defined-number-of-times-instead-of-repeating-over-array
      $scope.numberToArray = function(num) {
        return new Array(num);
      };

      $scope.updateFilter = function() {
        // we check by looping from end of array
        $scope.filteredModel = [];
        var i;

        if (typeof $scope.inputModel === 'undefined') {
          return [];
        }

        // === set default to visible label value ===
        var defaultSearchKey = $scope.buttonLabel;
        $scope.searchKey = $scope.searchKey || defaultSearchKey;


        //iterate through all objects
        for (i = $scope.inputModel.length - 1; i >= 0; i--) {

          // if it's group end
          if (typeof $scope.inputModel[ i ][ $scope.groupProperty ] !== 'undefined' && $scope.inputModel[ i ][ $scope.groupProperty ] === false) {
            $scope.filteredModel.push($scope.inputModel[ i ]);
          }

          // if it's data
          var gotData = false;
          if (typeof $scope.inputModel[ i ][ $scope.groupProperty ] === 'undefined') {

            var objectKeys = Object.keys($scope.inputModel[ i ]);
            var keysLength = objectKeys.length;
            var key;

            //iterate through current object's keys
            for (var index = 0; index < keysLength; index++) {
              key = objectKeys[index];

              // if filter string is in one of object property
              if (typeof $scope.inputModel[ i ][ key ] !== 'boolean' &&
                String($scope.inputModel[ i ][ key ]).toUpperCase().indexOf($scope.inputLabel.labelFilter.toUpperCase()) >= 0 &&
                $scope.searchKey &&
                $scope.searchKey.indexOf(key) !== -1) {
                gotData = true;
                break;
              }
            }

            if (gotData === true) {
              // push
              $scope.filteredModel.push($scope.inputModel[ i ]);
            }
          }

          // if it's group start
          if (typeof $scope.inputModel[ i ][ $scope.groupProperty ] !== 'undefined' && $scope.inputModel[ i ][ $scope.groupProperty ] === true) {

            if (typeof $scope.filteredModel[ $scope.filteredModel.length - 1 ][ $scope.groupProperty ] !== 'undefined' && $scope.filteredModel[ $scope.filteredModel.length - 1 ][ $scope.groupProperty ] === false) {
              $scope.filteredModel.pop();
            } else {
              $scope.filteredModel.push($scope.inputModel[ i ]);
            }
          }
        }

        $scope.filteredModel.reverse();
        $timeout(function() {
          $scope.getFormElements();
        }, 0);
      };

      $scope.throttledUpdateFilter = throttle($scope.updateFilter, 500);

      // List all the input elements.
      // This function will be called everytime the filter is updated. Not good for performance, but oh well..
      $scope.getFormElements = function() {
        $scope.formElements = [];
        for (var i = 0; i < element[ 0 ].getElementsByTagName('FORM')[ 0 ].elements.length; i++) {
          $scope.formElements.push(element[ 0 ].getElementsByTagName('FORM')[ 0 ].elements[ i ]);
        }
      };

      // check if an item has $scope.groupProperty (be it true or false)
      $scope.isGroupMarker = function(item, type) {
        if (typeof item[ $scope.groupProperty ] !== 'undefined' && item[ $scope.groupProperty ] === type) {
          return true;
        }
        return false;
      };

      $scope.removeGroupEndMarker = function(item) {
        if (typeof item[ $scope.groupProperty ] !== 'undefined' && item[ $scope.groupProperty ] === false) {
          return false;
        }
        return true;
      };


      // Show or hide a helper element
      $scope.displayHelper = function(elementString) {

        if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {

          switch (elementString.toUpperCase()) {
          case 'ALL':
            return false;
          case 'NONE':
            return false;
          case 'RESET':
            if (typeof attrs.helperElements === 'undefined') {
              return true;
            } else if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('RESET') >= 0) {
              return true;
            }
            break;
          case 'FILTER':
            if (typeof attrs.helperElements === 'undefined') {
              return true;
            }
            if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf('FILTER') >= 0) {
              return true;
            }
            break;
          default:
            break;
          }

          return false;
        }
        if (elementString.toUpperCase() === 'DONE') {
          return $scope.disableDone !== 'true';
        }
        if (typeof attrs.helperElements === 'undefined') {
          return true;
        }
        if (attrs.helperElements && $scope.helperElements.toUpperCase().indexOf(elementString.toUpperCase()) >= 0) {
          return true;
        }
        return false;
      };

      // call this function when an item is clicked
      $scope.syncItems = function(item, e, ng_repeat_index) {

        e.preventDefault();
        e.stopPropagation();

        // if it's globaly disabled, then don't do anything
        if (typeof attrs.disableProperty !== 'undefined' && item[ $scope.disableProperty ] === true) {
          return false;
        }

        // don't change disabled items
        if (typeof attrs.isDisabled !== 'undefined' && $scope.isDisabled === true) {
          return false;
        }

        // we don't care about end of group markers
        if (typeof item[ $scope.groupProperty ] !== 'undefined' && item[ $scope.groupProperty ] === false) {
          return false;
        }

        var index = $scope.filteredModel.indexOf(item);

        // process items if the start of group marker is clicked ( only for multiple selection! )
        // if, in a group, there are items which are not selected, then they all will be selected
        // if, in a group, all items are selected, then they all will be de-selected
        if (typeof item[ $scope.groupProperty ] !== 'undefined' && item[ $scope.groupProperty ] === true) {

          if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {
            return false;
          }

          var i;
          var j;
          var startIndex = 0;
          var endIndex = $scope.filteredModel.length - 1;
          var tempArr = [];
          var nestLevel = 0;
          var inputModelIndex;

          for (i = index; i < $scope.filteredModel.length; i++) {

            if (nestLevel === 0 && i > index) {
              break;
            }

            // if group start
            if (typeof $scope.filteredModel[ i ][ $scope.groupProperty ] !== 'undefined' && $scope.filteredModel[ i ][ $scope.groupProperty ] === true) {

              // To cater multi level grouping
              if (tempArr.length === 0) {
                startIndex = i + 1;
              }
              nestLevel = nestLevel + 1;
            } else if (typeof $scope.filteredModel[ i ][ $scope.groupProperty ] !== 'undefined' && $scope.filteredModel[ i ][ $scope.groupProperty ] === false) {

              nestLevel = nestLevel - 1;

              // cek if all are ticked or not
              if (tempArr.length > 0 && nestLevel === 0) {

                var allTicked = true;

                endIndex = i;

                for (j = 0; j < tempArr.length; j++) {
                  if (typeof tempArr[ j ][ $scope.tickProperty ] !== 'undefined' && tempArr[ j ][ $scope.tickProperty ] === false) {
                    allTicked = false;
                    break;
                  }
                }

                if (allTicked === true) {
                  for (j = startIndex; j <= endIndex; j++) {
                    if (typeof $scope.filteredModel[ j ][ $scope.groupProperty ] === 'undefined') {
                      if (typeof attrs.disableProperty === 'undefined') {
                        $scope.filteredModel[ j ][ $scope.tickProperty ] = false;
                        // we refresh input model as well
                        inputModelIndex = $scope.filteredModel[ j ][ $scope.indexProperty ];
                        $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = false;
                      } else if ($scope.filteredModel[ j ][ $scope.disableProperty ] !== true) {
                        $scope.filteredModel[ j ][ $scope.tickProperty ] = false;
                        // we refresh input model as well
                        inputModelIndex = $scope.filteredModel[ j ][ $scope.indexProperty ];
                        $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = false;
                      }
                    }
                  }
                } else {
                  for (j = startIndex; j <= endIndex; j++) {
                    if (typeof $scope.filteredModel[ j ][ $scope.groupProperty ] === 'undefined') {
                      if (typeof attrs.disableProperty === 'undefined') {
                        $scope.filteredModel[ j ][ $scope.tickProperty ] = true;
                        // we refresh input model as well
                        inputModelIndex = $scope.filteredModel[ j ][ $scope.indexProperty ];
                        $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = true;

                      } else if ($scope.filteredModel[ j ][ $scope.disableProperty ] !== true) {
                        $scope.filteredModel[ j ][ $scope.tickProperty ] = true;
                        // we refresh input model as well
                        inputModelIndex = $scope.filteredModel[ j ][ $scope.indexProperty ];
                        $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = true;
                      }
                    }
                  }
                }
              }
            } else {
              tempArr.push($scope.filteredModel[ i ]);
            }
          }
        } else { // single item click
          clickElement(index, e);
        }
        if ($scope.deepCopyDisabled) {
          $scope.clickedItem = _.clone(item);
        } else {
          $scope.clickedItem = angular.copy(item);
        }

        // We update the index here
        prevTabIndex = $scope.tabIndex;
        $scope.tabIndex = ng_repeat_index + helperItemsLength;

        // Set focus on the hidden checkbox
        e.target.focus();

        // set & remove CSS style
        $scope.removeFocusStyle(prevTabIndex);
        $scope.setFocusStyle($scope.tabIndex);
      };

      function clickElement(index, e) {
        var i;
        // If it's single selection mode
        if (attrs.selectionMode && $scope.selectionMode.toUpperCase() === 'SINGLE') {

          // first, set everything to false
          for (i = 0; i < $scope.filteredModel.length; i++) {
            $scope.filteredModel[ i ][ $scope.tickProperty ] = false;
          }
          for (i = 0; i < $scope.inputModel.length; i++) {
            $scope.inputModel[ i ][ $scope.tickProperty ] = false;
          }

          // then set the clicked item to true
          $scope.filteredModel[ index ][ $scope.tickProperty ] = true;

          $scope.toggleCheckboxes(e);
        } else { // Multiple
          $scope.filteredModel[ index ][ $scope.tickProperty ] = !$scope.filteredModel[ index ][ $scope.tickProperty ];
        }

        // we refresh input model as well
        var inputModelIndex = $scope.filteredModel[ index ][ $scope.indexProperty ];
        $scope.inputModel[ inputModelIndex ][ $scope.tickProperty ] = $scope.filteredModel[ index ][ $scope.tickProperty ];
      }

      // update $scope.selectedItems
      // this variable is used in $scope.outputModel and to refresh the button label
      $scope.refreshSelectedItems = function() {
        $scope.selectedItems = [];
        _.forEach($scope.inputModel, function(value/*, key*/) {
          if (typeof value !== 'undefined') {
            if (typeof value[ $scope.groupProperty ] === 'undefined') {
              if (value[ $scope.tickProperty ] === true) {
                $scope.selectedItems.push(value);
              }
            }
          }
        });
      };

      // refresh output model as well
      $scope.refreshOutputModel = function() {
        if (typeof attrs.outputModel !== 'undefined') {
          if ($scope.deepCopyDisabled) {
            $scope.outputModel = _.clone($scope.selectedItems);
            _.forEach($scope.outputModel, function(value/*, key*/) {
              // remove the index number and spacing number from output model
              delete value[ $scope.indexProperty ];
              delete value[ $scope.spacingProperty ];
            });
            return;
          }
          $scope.outputModel = angular.copy($scope.selectedItems);
          _.forEach($scope.outputModel, function(value/*, key*/) {
            // remove the index number and spacing number from output model
            delete value[ $scope.indexProperty ];
            delete value[ $scope.spacingProperty ];
          });
        }
      };

      // refresh button label
      $scope.refreshButton = function(/*newVal*/) {
        $scope.varButtonLabel = '';
        var ctr = 0;

        // refresh button label...
        if ($scope.selectedItems.length === 0) {
          // https://github.com/isteven/angular-multi-select/pull/19
          $scope.varButtonLabel = ( typeof $scope.defaultLabel !== 'undefined' ) ? $scope.defaultLabel : 'None selected';
        } else {
          var tempMaxLabels = $scope.selectedItems.length;
          if (typeof $scope.maxLabels !== 'undefined' && $scope.maxLabels !== '') {
            tempMaxLabels = $scope.maxLabels;
          }

          // if max amount of labels displayed..
          if ($scope.selectedItems.length > tempMaxLabels) {
            $scope.more = true;
          } else {
            $scope.more = false;
          }
          if ($scope.selectedLabelRenderer) {
            var fnName = $scope.selectedLabelRenderer;
            $scope.varButtonLabel = $scope.$parent.fn[fnName].call(undefined, $scope.selectedItems);
          } else {
            _.forEach($scope.selectedItems, function(value/*, key*/) {
              if (typeof value !== 'undefined') {
                if (ctr < tempMaxLabels) {
                  $scope.varButtonLabel += ( $scope.varButtonLabel.length > 0 ? '</div>, <div class="buttonLabel">' : '<div class="buttonLabel">') + $scope.writeLabel(value,
                    'buttonLabel');
                }
                ctr++;
              }
            });
          }

          if ($scope.more === true) {
            // https://github.com/isteven/angular-multi-select/pull/16
            if (tempMaxLabels > 0) {
              $scope.varButtonLabel += ', ... ';
            }
            $scope.varButtonLabel += 'Selected: ' + $scope.selectedItems.length + ' / ' + $scope.inputModel.length;
          }
        }
        $scope.varButtonLabel = $sce.trustAsHtml($scope.varButtonLabel + '<span class="caret"></span>');
      };

      // Check if a checkbox is disabled or enabled. It will check the granular control (disableProperty) and global control (isDisabled)
      // Take note that the granular control has higher priority.
      $scope.itemIsDisabled = function(item) {

        if (typeof attrs.disableProperty !== 'undefined' && item[ $scope.disableProperty ] === true) {
          return true;
        } else if ($scope.isDisabled === true) {
          return true;
        }
        return false;
      };

      // A simple function to parse the item label settings
      $scope.writeLabel = function(item, type) {
        var label = '';
        var temp = $scope[ type ].split(' ');
        var classes = $scope.displayClasses ? $scope.displayClasses.split(' ') : [];

        // iterate through labels : temp == [name,id];
        _.forEach(temp, function(value2, key2) {
          if (typeof value2 !== 'undefined') {

            // iterate through selected items in filtered array : item == current object in filteredArray
            _.forEach(item, function(value1, key1) {
              if (key1 == value2) { //eslint-disable-line eqeqeq
                label += '&nbsp;' + (classes[key2] ? '<span class="' + classes[key2] + '" >' + value1 + '</span>' : value1);
              }
            });
          }
        });
        if (type.toUpperCase() === 'BUTTONLABEL') {
          return label;
        }
        return $sce.trustAsHtml(label);
      };

      // UI operations to show/hide checkboxes based on click event..
      $scope.toggleCheckboxes = function(e) {

        $scope.$emit('multiSelectChange');

        // We grab the checkboxLayer
        $scope.checkBoxLayer = element.children()[1];

        // We grab the button
        var clickedEl = element.children()[0];

        // Just to make sure.. had a bug where key events were recorded twice
        angular.element(document).unbind('click', $scope.externalClickListener);
        angular.element(document).unbind('keydown', $scope.keyboardListener);

        // clear filter
        $scope.inputLabel.labelFilter = '';
        $scope.updateFilter();

        // close if ESC key is pressed.
        if (e.keyCode === 27) {
          angular.element($scope.checkBoxLayer).removeClass('show');
          angular.element(clickedEl).removeClass('buttonClicked');
          angular.element(document).unbind('click', $scope.externalClickListener);
          angular.element(document).unbind('keydown', $scope.keyboardListener);

          // clear the focused element;
          $scope.removeFocusStyle($scope.tabIndex);

          // close callback
          $timeout(function() {
            $scope.onClose({ data: $scope.outputModel });
          });
          return true;
        }

        // The idea below was taken from another multi-select directive - https://github.com/amitava82/angular-multiselect
        // His version is awesome if you need a more simple multi-select approach.

        // close
        if (angular.element($scope.checkBoxLayer).hasClass('show')) {
          angular.element($scope.checkBoxLayer).removeClass('show');
          angular.element(clickedEl).removeClass('buttonClicked');
          angular.element(document).unbind('click', $scope.externalClickListener);
          angular.element(document).unbind('keydown', $scope.keyboardListener);

          // clear the focused element;
          $scope.removeFocusStyle($scope.tabIndex);

          // close callback
          $timeout(function() {
            $scope.onClose({ data: $scope.outputModel });
          });
        } else {
          helperItems = [];
          helperItemsLength = 0;

          angular.element($scope.checkBoxLayer).addClass('show');
          angular.element(clickedEl).addClass('buttonClicked');
          angular.element(document).bind('click', $scope.externalClickListener);
          angular.element(document).bind('keydown', $scope.keyboardListener);

          // to get the initial tab index, depending on how many helper elements we have.
          // priority is to always focus it on the input filter
          $scope.getFormElements();
          $scope.tabIndex = 0;

          var helperContainer = angular.element(element[ 0 ].querySelector('.helperContainer'))[0];

          if (typeof helperContainer !== 'undefined') {
            for (var i = 0; i < helperContainer.getElementsByTagName('BUTTON').length; i++) {
              helperItems[ i ] = helperContainer.getElementsByTagName('BUTTON')[ i ];
            }
            helperItemsLength = helperItems.length + helperContainer.getElementsByTagName('INPUT').length;
          }

          // focus on the filter element on open.
          if (element[ 0 ].querySelector('.inputFilter')) {
            element[ 0 ].querySelector('.inputFilter').focus();
            $scope.tabIndex = $scope.tabIndex + helperItemsLength - 2;
          } else {
            // if there's no filter then just focus on the first checkbox item
            $scope.formElements[ $scope.tabIndex ].focus();
          }

          // open callback
          $scope.onOpen({ data: element });
        }
      };

      // handle clicks outside the button / multi select layer
      $scope.externalClickListener = function(e) {
        var targetsArr = element.find(e.target.tagName);
        for (var i = 0; i < targetsArr.length; i++) {
          if (e.target == targetsArr[i]) { // eslint-disable-line eqeqeq
            return;
          }
        }

        angular.element($scope.checkBoxLayer.previousSibling).removeClass('buttonClicked');
        angular.element($scope.checkBoxLayer).removeClass('show');
        angular.element(document).unbind('click', $scope.externalClickListener);
        angular.element(document).unbind('keydown', $scope.keyboardListener);

        // close callback
        $timeout(function() {
          $scope.onClose({ data: $scope.outputModel });
        }, 0);
      };

      // traverse up to find the button tag
      // http://stackoverflow.com/questions/7332179/how-to-recursively-search-all-parentnodes
      $scope.findUpTag = function(el, tag, className) {
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

      // select All / select None / reset / done buttons
      $scope.select = function(type, e) {
        var temp;
        var helperIndex = helperItems.indexOf(e.target);
        $scope.tabIndex = helperIndex;

        switch (type.toUpperCase()) {
        case 'ALL':
          _.forEach($scope.filteredModel, function(value/*, key*/) {
            if (typeof value !== 'undefined' && value[ $scope.disableProperty ] !== true) {
              if (typeof value[ $scope.groupProperty ] === 'undefined') {
                value[ $scope.tickProperty ] = true;
              }
            }
            $scope.onSelectAllClick();
          });
          break;
        case 'NONE':
          _.forEach($scope.filteredModel, function(value/*, key*/) {
            if (typeof value !== 'undefined' && value[ $scope.disableProperty ] !== true) {
              if (typeof value[ $scope.groupProperty ] === 'undefined') {
                value[ $scope.tickProperty ] = false;
              }
            }
          });
          break;
        case 'RESET':
          _.forEach($scope.filteredModel, function(value/*, key*/) {
            if (typeof value[ $scope.groupProperty ] === 'undefined' && typeof value !== 'undefined' && value[ $scope.disableProperty ] !== true) {
              temp = value[ $scope.indexProperty ];
              value[ $scope.tickProperty ] = $scope.backUp[ temp ][ $scope.tickProperty ];
            }
          });
          break;
        case 'CLEAR':
          $scope.tabIndex = $scope.tabIndex + 1;
          break;
        case 'FILTER':
          $scope.tabIndex = helperItems.length - 1;
          break;
        case 'DONE':
          $scope.toggleCheckboxes(e);
          break;
        default:
        }
      };

      // just to create a random variable name
      function genRandomString(length) {
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var temp = '';
        for (var i = 0; i < length; i++) {
          temp += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return temp;
      }

      // count leading spaces
      $scope.prepareGrouping = function() {
        var spacing = 0;
        _.forEach($scope.filteredModel, function(value/*, key*/) {
          value[ $scope.spacingProperty ] = spacing;
          if (value[ $scope.groupProperty ] === true) {
            spacing += 2;
          } else if (value[ $scope.groupProperty ] === false) {
            spacing -= 2;
          }
        });
      };

      // prepare original index
      $scope.prepareIndex = function() {
        var ctr = 0;
        _.forEach($scope.filteredModel, function(value/*, key*/) {
          value[ $scope.indexProperty ] = ctr;
          ctr++;
        });
      };

      // navigate using up and down arrow
      $scope.keyboardListener = function(e) {

        var key = e.keyCode ? e.keyCode : e.which;
        var isNavigationKey = false;

        // ESC key (close)
        if (key === 27) {
          $scope.toggleCheckboxes(e);
        } else if (key === 40 || key === 39 || ( !e.shiftKey && key == 9 )) { // eslint-disable-line eqeqeq
          // next element ( tab [9], down [40] & right [39] key )
          isNavigationKey = true;
          prevTabIndex = $scope.tabIndex;
          $scope.tabIndex++;
          if ($scope.tabIndex > $scope.formElements.length - 1) {
            $scope.tabIndex = 0;
            prevTabIndex = $scope.formElements.length - 1;
          }
          while ($scope.formElements[ $scope.tabIndex ].disabled === true) {
            $scope.tabIndex++;
            if ($scope.tabIndex > $scope.formElements.length - 1) {
              $scope.tabIndex = 0;
            }
          }
        } else if (key === 38 || key === 37 || ( e.shiftKey && parseInt(key, 10) === 9 )) {
          // prev element ( shift+tab, up[38] & left[37] key )
          isNavigationKey = true;
          prevTabIndex = $scope.tabIndex;
          $scope.tabIndex--;
          if ($scope.tabIndex < 0) {
            $scope.tabIndex = $scope.formElements.length - 1;
            prevTabIndex = 0;
          }
          while ($scope.formElements[ $scope.tabIndex ].disabled === true) {
            $scope.tabIndex--;
            if ($scope.tabIndex < 0) {
              $scope.tabIndex = $scope.formElements.length - 1;
            }
          }
        } else if (key === 13) {
          // Hack to allow 'Enter' key to select and close dropdown in single-select.

          var offset = 0;
          if (element[ 0 ].querySelector('.inputFilter')) {
            offset = 2;
          }
          clickElement($scope.tabIndex - helperItemsLength - offset, e);

        }


        // Hack to allow arrow keys inside the inputFilter (search) input.
        if (/inputFilter/.test(e.currentTarget.activeElement.className)) {
          isNavigationKey = false;
        }

        if (isNavigationKey === true) {

          e.preventDefault();
          e.stopPropagation();

          // set focus on the checkbox
          $scope.formElements[ $scope.tabIndex ].focus();

          // css styling
          var actEl = document.activeElement;

          if (actEl.type.toUpperCase() === 'CHECKBOX') {
            $scope.setFocusStyle($scope.tabIndex);
            $scope.removeFocusStyle(prevTabIndex);
          } else {
            $scope.removeFocusStyle(prevTabIndex);
            $scope.removeFocusStyle(helperItemsLength);
            $scope.removeFocusStyle($scope.formElements.length - 1);
          }
        }

        isNavigationKey = false;
      };

      // set (add) CSS style on selected row
      $scope.setFocusStyle = function(tabIndex) {
        angular.element($scope.formElements[ tabIndex ]).parent().parent().parent().addClass('multiSelectFocus');
      };

      // remove CSS style on selected row
      $scope.removeFocusStyle = function(tabIndex) {
        angular.element($scope.formElements[ tabIndex ]).parent().parent().parent().removeClass('multiSelectFocus');
      };

      ///////////////////////////////////////////////////////
      //
      // Logic starts here, initiated by watch 1 & watch 2.
      //
      ///////////////////////////////////////////////////////

      var tempStr = genRandomString(5);
      $scope.indexProperty = 'idx_' + tempStr;
      $scope.spacingProperty = 'spc_' + tempStr;

      // set orientation css
      if (typeof attrs.orientation !== 'undefined') {
        if (attrs.orientation.toUpperCase() === 'HORIZONTAL') {
          $scope.orientationH = true;
          $scope.orientationV = false;
        } else {
          $scope.orientationH = false;
          $scope.orientationV = true;
        }
      }

      // watch1, for changes in input model property
      // updates multi-select when user select/deselect a single checkbox programatically
      // https://github.com/isteven/angular-multi-select/issues/8

      $scope.$watch('inputModel', function(newVal) {

        if (newVal) {
          $scope.refreshSelectedItems();
          $scope.refreshOutputModel();
          $scope.refreshButton();
          if ($scope.clickedItem !== null) {
            $timeout(function() {
              $scope.onItemClick({ data: $scope.clickedItem });
              $scope.clickedItem = null;
            }, 0);
          }

          if ($scope.maxSelectedItems) {
            var shouldDisableItem = $scope.selectedItems && $scope.selectedItems.length >= $scope.maxSelectedItems;

            _.forEach($scope.inputModel, function(item) {
              if (!item[$scope.tickProperty]) {
                item[$scope.disableProperty] = shouldDisableItem;
              }
            });
          }
        }
      }, true);

      // watch2 for changes in input model as a whole
      // this on updates the multi-select when a user load a whole new input-model. We also update the $scope.backUp variable
      $scope.$watch('inputModel', function(newVal) {
        if (newVal) {
          $scope.inputModel = $scope.$eval(newVal);
          if ($scope.deepCopyDisabled) {
            $scope.backUp = _.clone($scope.inputModel);
          } else {
            $scope.backUp = angular.copy($scope.inputModel);
          }
          $scope.updateFilter();
          $scope.prepareGrouping();
          $scope.prepareIndex();
          $scope.refreshSelectedItems();
          $scope.refreshOutputModel();
          $scope.refreshButton();
        }

        $scope.$emit('multiSelectChange');
      });

      // watch for changes in directive state (disabled or enabled)
      $scope.$watch('isDisabled', function(newVal) {
        $scope.isDisabled = newVal;
      });

      // this is for touch enabled devices. We don't want to hide checkboxes on scroll.
      angular.element(document).bind('touchstart', function(/*e*/) {
        $scope.$apply(function() {
          $scope.scrolled = false;
        });
      });

      // also for touch enabled devices
      angular.element(document).bind('touchmove', function(/*e*/) {
        $scope.$apply(function() {
          $scope.scrolled = true;
        });
      });

      // for IE8, perhaps. Not sure if this is really executed.
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(what, i) { // eslint-disable-line no-extend-native
          i = i || 0;
          var L = this.length;
          while (i < L) {
            if (this[i] === what) {
              return i;
            }
            ++i;
          }
          return -1;
        };
      }

      $scope.$emit('multiSelectChange');
    }
  };
}]).directive('subfilter', ['$sce', '$timeout', '$log', function(/*$sce, $timeout, $log*/) {

  var rowHeight = 31;
  var showMax = 10;

  var link = function($scope, element) {
    var longest = 0;

    var throttle = function(fn, threshhold, scope) {
      threshhold = threshhold || 250;
      var last;
      var deferTimer;
      return function() {
        var context = scope || this;

        var now = Number(new Date());
        var args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function() {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    };

    var lastScrollPosition = 0;

    var setAllWidthsTo = function(widthValue) {
      var $multiSelectItems = $(element).parent().find('.multiSelectItem');
      for (var i = 0; i < $multiSelectItems.length; i++) {
        $($multiSelectItems[i]).width(widthValue);
      }
    };

    $(element).parent().scope().$watch('filteredModel', function(newVal) {

      //init position to 0;
      longest = 0;
      var scrollTop = $(element).scrollTop(0);
      setAllWidthsTo('auto');
      setWidthToWidestElement();
      setAllWidthsTo(longest);

      for (var c = 0; c < newVal.length; c++) {
        newVal[c].displayIndex = c;
      }

      $(element).parent().scope().subFilteredModel = newVal.slice(0, showMax);
      $scope.containerHeight = $(element).parent().scope().filteredModel.length * rowHeight;

      var throttledScroll = throttle(function() {
        scrollTop = $(element).scrollTop();
        var topElPos = Math.floor(scrollTop / rowHeight);
        if (lastScrollPosition === topElPos) {
          return;
        }
        lastScrollPosition = topElPos;
        $(element).parent().scope().subFilteredModel = newVal.slice(topElPos, topElPos + showMax);
        $(element).parent().scope().$digest();
        setWidthToWidestElement();
        setAllWidthsTo(longest);

      }, 200);

      function setWidthToWidestElement() {
        var $multiSelectItems = $(element).parent().find('.multiSelectItem');

        if ($multiSelectItems.length) {

          for (var i = 0; i < $multiSelectItems.length; i++) {
            if ($($multiSelectItems[i]).width() > longest) {
              longest = $($multiSelectItems[i]).width();
            }
          }

          $(element).width(longest);
        }
      }

      $(element).off('scroll');
      $(element).on('scroll', throttledScroll);


    });

  };
  return {
    restrict: 'A',
    transclude:true,
    template:'<div ng-style="{\'height\':containerHeight+\'px\'}" style="overflow:hidden;position:relative" ng-transclude=""></div>',
    scope:{
      subfilter:'='
    },
    link:link
  };
}]);
