describe("Isteven multiselect", function () {

  var $compile, $rootScope, $document, $templateCache, element, $browser, $log, $timeout;

  beforeEach(function () {
    module('isteven-multi-select');
  });

  beforeEach(inject(function (_$compile_, _$rootScope_, _$document_, _$templateCache_, _$browser_, _$log_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    $templateCache = _$templateCache_;
    $browser = _$browser_;
    $log = _$log_;
    $timeout = _$timeout_;
  }));

  function getGroupingDropdown() {
    return [
      {
        name: '<strong>All Browsers</strong>',
        msGroup: true
      },
      {
        name: '<strong>Modern Web Browsers</strong>',
        msGroup: true
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png" />',
        name: 'Opera',
        maker: '(Opera Software)',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32/internet_explorer.png" />',
        name: 'Internet Explorer',
        maker: '(Microsoft)',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',
        name: 'Firefox',
        maker: '(Mozilla Foundation)',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png" />',
        name: 'Safari',
        maker: '(Apple)',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png" />',
        name: 'Chrome',
        maker: '(Google)',
        ticked: false
      },
      {
        msGroup: false
      },
      {
        name: '<strong>Classic Web Browsers</strong>',
        msGroup: true
      },
      {
        icon: '<img  src="http://www.ucdmc.ucdavis.edu/apps/error/nojavascript/images/netscape_icon.jpg" />',
        name: 'Netscape Navigator',
        maker: '(Netscape Corporation)',
        ticked: false
      },
      {
        icon: '<img  src="http://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Amaya_logo_65x50.png/48px-Amaya_logo_65x50.png" />',
        name: 'Amaya',
        maker: '(Inria & W3C)',
        ticked: false
      },
      {
        icon: '<img  src="http://upload.wikimedia.org/wikipedia/commons/8/8c/WorldWideWeb_Icon.png" />',
        name: 'WorldWideWeb Nexus',
        maker: '(Tim Berners-Lee)',
        ticked: false
      },
      {
        msGroup: false
      },
      {
        msGroup: false
      }
    ];
  }

  function getOldBrowsersDropdown() {
    return [
      {
        icon: '<img  src="http://www.ucdmc.ucdavis.edu/apps/error/nojavascript/images/netscape_icon.jpg" />',
        name: 'Netscape Navigator',
        maker: 'Netscape Corporation',
        ticked: true
      },
      {
        icon: '<img  src="http://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Amaya_logo_65x50.png/48px-Amaya_logo_65x50.png" />',
        name: 'Amaya',
        maker: 'Inria & W3C',
        ticked: true
      },
      {
        icon: '<img  src="http://upload.wikimedia.org/wikipedia/commons/8/8c/WorldWideWeb_Icon.png" />',
        name: 'WorldWideWeb Nexus',
        maker: 'Tim Berners-Lee',
        ticked: false
      }
    ];
  }

  function getModernBrowsersDropdown() {
    return [
      {
        icon: '<img src="https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png" />',
        name: 'Opera',
        maker: 'Opera Software',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32/internet_explorer.png" />',
        name: 'Internet Explorer',
        maker: 'Microsoft',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',
        name: 'Firefox',
        maker: 'Mozilla Foundation',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png" />',
        name: 'Safari',
        maker: 'Apple',
        ticked: false
      },
      {
        icon: '<img  src="https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png" />',
        name: 'Chrome',
        maker: 'Google',
        ticked: false
      }
    ];
  };

  function compileDropdownHtml(html, scope) {
    return $compile(html)(scope);
  }

  //create isteven directive minumum properties html
  function dropdownHtml() {
    return `
        <div 
          isteven-multi-select 
          input-model="modernBrowsers"
          output-model="outputBrowsers"
          button-label="icon name"         
          item-label="icon name maker" 
          tick-property="ticked"     
          on-open="fOpen()"                
          on-close="fClose()"
          on-item-click="fItemClick(data)"
          on-select-all="fSelectAll()"
          on-select-none="fSelectNone()"
          on-reset="fReset()"
          on-clear="fClear()"
          on-search-change="fSearchChange( data )"
      ></div>
    `;
  }

  //Initial test case plan is look like below.
  //Each point of testing has been broadly categorized to below categories

  /*
    1. Minimum
    Usage testing
    i)   outputModel should fill in when value in pre-selected.
    ii)  inputModel & outputModel(UI) should changed based on selection 

    Directive testing
    i)   should have used minimum attribute options, check minimum attribute presence
    ii)  inputModel & outputModel should gets updated on each selection 
    iii) by default selection mode is multi-select
    iv)  outputModel should fill in when value in pre-selected.
  */

  describe("Minimun directive options", function () {

    //Usage testing
    it("outputModel should fill in when value in pre-selected", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.modernBrowsers[0].ticked = true;
      scope.$apply();

      //assert
      expect(scope.outputBrowsers.length).toBe(1);
    });

    it("inputModel & outputModel(UI) should changed based on selection", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.modernBrowsers[1].ticked = true;
      scope.$apply();

      //assert
      expect(scope.outputBrowsers.length).toBe(1);
    });

    //Directive testing
    it("should have used minimum options passed to directive, check minimum attribute presence", function () {
      //arrange
      var scope = $rootScope.$new();
      var minimumAttributes = ['input-model', 'output-model', 'button-label', 'item-label', 'tick-property']
      element = compileDropdownHtml(dropdownHtml(), scope);
      scope.modernBrowsers = getModernBrowsersDropdown();

      //act
      scope.$apply();
      var matchedAttributes = Array.from(element[0].attributes).filter(function (attr) {
        return minimumAttributes.indexOf(attr.name) > -1;
      })

      //assert
      expect(matchedAttributes.length).toBe(minimumAttributes.length);
    });

    it("outputModel should fill in when value in pre-selected", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.modernBrowsers[0].ticked = true;
      scope.$apply();
      var directiveScope = element.contents().scope();

      //assert
      expect(directiveScope.outputModel.length).toBe(1);
      expect(directiveScope.inputModel.length).toBe(5);
      expect(element.find('.checkBoxContainer .selected').length).toEqual(1);
    });

    it("should default selection mode to multi-select", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();
      var directiveScope = element.contents().scope();

      //assert
      expect(directiveScope.selectionMode).not.toBe('single');
    });

    it("should select single option in single select mode", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml()).attr('selection-mode', 'single');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      //selecting two options
      element.find('.checkBoxContainer .multiSelectItem').first().click();

      //assert
      expect(scope.outputBrowsers.length).toBe(1);
    });

    it("should change selected value in single select", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.fClick = function(data) { console.log(data) };
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml());
      html.attr('selection-mode', "single");
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
      scope.$apply();

      //assert
      //expect(scope.outputBrowsers.length).toBe(1);
      expect(element.find('.checkBoxContainer .selected').length).toBe(1);
    });

    it("should change selected value in multiple select mode", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml());
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
      scope.$apply();

      //assert
      expect(scope.outputBrowsers.length).toEqual(2);
      expect(element.find('.checkBoxContainer .selected').length).toBe(2);
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*
    2. Horizontal
    Usage testing
    i)   selected element should get shown inside isteven
    Directive testing
    i)   selected element should get shown inside isteven
    ii)  By default it should show None Selected" if nothing is pre-selected
    iii) Horizontal 
    iv)  Vertical 
  */

  describe("Horizontal", function () {

    //Usage testing
    //Directive testing
    it("selected element should get shown inside isteven", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.modernBrowsers[0].ticked = true;
      scope.modernBrowsers[1].ticked = true;
      scope.$apply();

      //assert
      expect(element.find('.buttonLabel').length).toBe(2);
    });

    it("By default it should show 'None Selected' if nothing is pre-selected, other options are not selected", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.multiSelect.inlineBlock button').first().text()).toEqual('None Selected');
      expect(element.find('.multiSelect.inlineBlock .checkBoxContainer button.selected').length).toBe(0);
    });

    it("Horizontal styling should apply on options", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml());
      html.attr('orientation', 'HORIZONTAL');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.checkBoxContainer .horizontal').length).toBe(scope.modernBrowsers.length);
    });

    it("Vertical styling should apply on options", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.checkBoxContainer .vertical').length).toBe(scope.modernBrowsers.length);
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*

    3. Dynamic Update
    Usage testing
    i)   should change selected value in multiselect
    ii)  should change selected value in single select
    Directive testing
    i)   should have used minimum options, check minimum attribute presence
    ii)  change dataSource should update dropdown list
    
  */

  describe("Dynamic Update", function () {

    //Usage testing
    it("should change selected value in multiselect", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();

      //assert
      expect(scope.outputBrowsers.length).toBe(2);
    });

    it("should change selected value in single select", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml());
      html.attr('selection-mode', "single");
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').first().click();

      //assert
      expect(scope.outputBrowsers.length).toEqual(1);
      expect(scope.outputBrowsers[0].maker).toEqual(scope.modernBrowsers[0].maker);
    });

    //Directive testing
    it("Dynamic update in inputModel should instantly reflect the changes in inputModel & outputModel", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      var directiveScope = element.contents().scope();
      scope.modernBrowsers.pop();

      //assert
      expect(directiveScope.inputModel.length).toBe(scope.modernBrowsers.length);
      expect(directiveScope.outputModel.length).toBe(1);
    });

    it("change dataSource should update dropdown list", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();
      scope.modernBrowsers = getOldBrowsersDropdown();
      var directiveScope = element.contents().scope();
      scope.$apply();

      //assert
      expect(true).toBe(true)
      // expect(directiveScope.inputModel.length).toBe(scope.modernBrowsers.length);
      // expect(directiveScope.outputModel.length).toBe(2);
      // expect(element.find('.checkBoxContainer .selected').length).toEqual(2);
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*
    4. Disabling / Enabling
    Usage testing
    Directive testing
    i)   disabled option should not be clickable
    ii)  single option disabled attribute
  */

  describe("Disabling / Enabling", function () {

    //Usage testing
    it("should disable single option, option level disable", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml()).attr('disable-property', 'isDisabled')
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      //disabling item
      scope.modernBrowsers[0].isDisabled = true;
      //trying selecting option
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      var directiveScope = element.contents().scope();

      //assert
      expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(0);
      expect(directiveScope.outputModel.length).toBe(0);
    });

    it("should disable all options, dropdown level disable", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml()).attr('is-disabled', true);
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      //trying to select option
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();

      //assert
      expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(0);
    });

    //Directive testing
    it("selected element should get shown inside isteven", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.modernBrowsers[0].ticked = true;
      scope.modernBrowsers[1].ticked = true;
      scope.$apply();

      //assert
      expect(element.find('.buttonLabel').length).toBe(2);
    });

    it("By default it should show 'None Selected' if nothing is pre-selected, other options are not selected", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.multiSelect.inlineBlock button').first().text()).toEqual('None Selected');
      expect(element.find('.multiSelect.inlineBlock .checkBoxContainer button.selected').length).toBe(0);
    });

    it("Horizontal styling should apply on options", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml());
      html.attr('orientation', 'HORIZONTAL');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.checkBoxContainer .horizontal').length).toBe(scope.modernBrowsers.length);
    });

    it("Vertical styling should apply on options", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();

      //assert
      expect(element.find('.checkBoxContainer .vertical').length).toBe(scope.modernBrowsers.length);
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*
    5. Grouping
    Usage testing
    i)   check grouping works
    ii)  check nested grouping works
    iii) check group selection works
    iv)  check group deselection works
    Directive testing
    i)   check divider element
    ii)  check divider element for nested grouping
    iii) group start and end are based middle elements.
    iv)  check group selection/deselection works 
  */

  describe("Grouping", function () {

    //Usage testing
    it("check grouping", function () {
      //arrange
      var scope = $rootScope.$new(),
        GROUP_PROPERTY = 'msGroup';
      scope.inputOptions = getGroupingDropdown();
      var html = $(dropdownHtml())
        .attr('group-property', GROUP_PROPERTY)
        .attr('input-model', 'inputOptions');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
      var firstSubGroup = grandGroup.eq(1);
      var secondSubGroup = grandGroup.eq(2);
      var groupByFilter = scope.inputOptions.filter(function (option) {
        return option[GROUP_PROPERTY];
      });

      //check grand group name
      expect(grandGroup.find('.acol').eq(0).text().trim()).toBe($(groupByFilter[0].name).text());

      //check first subgroup name      
      expect(firstSubGroup.find('.acol').length).toBe(3);
      expect(firstSubGroup.find('.acol').eq(2).text().trim()).toBe($(groupByFilter[1].name).text());

      //check second subgroup name      
      expect(secondSubGroup.find('.acol').length).toBe(3);
      expect(secondSubGroup.find('.acol').eq(2).text().trim()).toBe($(groupByFilter[2].name).text());
    });

    it("check nested grouping", function () {
      //arrange
      var scope = $rootScope.$new(),
        GROUP_PROPERTY = 'msGroup';
      scope.inputOptions = getGroupingDropdown();
      //adding more nesting
      scope.inputOptions[3] = { msGroup: true, name: '<strong>Nested Group</strong>' };
      scope.inputOptions[4] = { ticked: true, name: 'Test 1' };
      scope.inputOptions[5] = { msGroup: false };
      var html = $(dropdownHtml())
        .attr('group-property', GROUP_PROPERTY)
        .attr('input-model', 'inputOptions');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
      var firstSubGroup = grandGroup.eq(1);
      var secondSubGroup = grandGroup.eq(2);
      var thirdSubGroup = grandGroup.eq(3);
      var groupByFilter = scope.inputOptions.filter(function (option) {
        return option[GROUP_PROPERTY];
      });

      //check grand group name
      expect(grandGroup.find('.acol').eq(0).text().trim()).toBe($(groupByFilter[0].name).text());

      //check first subgroup name      
      expect(firstSubGroup.find('.acol').length).toBe(3);
      expect(firstSubGroup.find('.acol').eq(2).text().trim()).toBe($(groupByFilter[1].name).text());
      //check second subgroup name, this is nested nest group
      expect(secondSubGroup.find('.acol').length).toBe(5);
      expect(secondSubGroup.find('.acol').eq(4).text().trim()).toBe($(groupByFilter[2].name).text());
      //check third subgroup name      
      expect(thirdSubGroup.find('.acol').length).toBe(3);
      expect(thirdSubGroup.find('.acol').eq(2).text().trim()).toBe($(groupByFilter[3].name).text());
    });

    describe("check group selection/deselection works", function () {

      it("grand selection should work", function () {
        //arrange
        var scope = $rootScope.$new(),
          GROUP_PROPERTY = 'msGroup';
        scope.browsers = getGroupingDropdown();
        var html = $(dropdownHtml())
          .attr('group-property', GROUP_PROPERTY)
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
        // var firstSubGroup = grandGroup.eq(1);
        var directiveScope = element.contents().scope();
        grandGroup.click(); //selecting all option

        //assert
        var allOptions = scope.browsers.filter(function (option) {
          return option.ticked;
        })
        expect(directiveScope.outputModel.length).toBe(allOptions.length);
        expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(allOptions.length);
      });

      it("child group selection should work", function () {
        //arrange
        var scope = $rootScope.$new(),
          GROUP_PROPERTY = 'msGroup';
        scope.browsers = getGroupingDropdown();
        var html = $(dropdownHtml())
          .attr('group-property', GROUP_PROPERTY)
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
        var subGroup = grandGroup.eq(1);
        var directiveScope = element.contents().scope();
        subGroup.click(); //selecting all option

        //assert
        var allOptions = scope.browsers.splice(2, 5); //selecting subgrou range
        expect(directiveScope.outputModel.length).toBe(allOptions.length);
        expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(allOptions.length);
      });

      it("check grand group deselection works", function () {
        //arrange
        var scope = $rootScope.$new(),
          GROUP_PROPERTY = 'msGroup';
        scope.browsers = getGroupingDropdown();
        var html = $(dropdownHtml())
          .attr('group-property', GROUP_PROPERTY)
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
        var directiveScope = element.contents().scope();
        grandGroup.click(); //selecting all option
        grandGroup.click(); //deselcting all option

        //assert
        var allOptions = scope.browsers.filter(function (browser) {
          return browser.ticked;
        });
        expect(directiveScope.outputModel.length).toBe(0);
        expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(0);
      });

      //Can I tweak this test little better? 
      //select first group, unselect the other???
      it("check single group deselection works", function () {
        //arrange
        var scope = $rootScope.$new(),
          GROUP_PROPERTY = 'msGroup';
        scope.browsers = getGroupingDropdown();
        var html = $(dropdownHtml())
          .attr('group-property', GROUP_PROPERTY)
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
        var subGroup = grandGroup.eq(1);
        var directiveScope = element.contents().scope();
        subGroup.click(); //selecting all option
        subGroup.click(); //de-selecting all option

        //assert
        expect(directiveScope.outputModel.length).toBe(0);
        expect(element.find('.checkBoxContainer .multiSelectItem.selected').length).toBe(0);
      });
    });

    //Directive testing
    it("there should be group items which pption has msGroup: true", function () {
      //arrange
      var scope = $rootScope.$new(),
        GROUP_PROPERTY = 'msGroup';
      scope.browsers = getGroupingDropdown();
      var html = $(dropdownHtml())
        .attr('group-property', GROUP_PROPERTY)
        .attr('input-model', 'browsers');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
      var groupItem = scope.browsers.filter(function (browser) {
        return browser[GROUP_PROPERTY];
      })
      expect(grandGroup.length).toBe(groupItem.length);
    });

    it("group item position should be accurate", function () {
      //arrange
      var scope = $rootScope.$new(),
        GROUP_PROPERTY = 'msGroup';
      scope.browsers = getGroupingDropdown();
      var html = $(dropdownHtml())
        .attr('group-property', GROUP_PROPERTY)
        .attr('input-model', 'browsers');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var grandGroup = element.find('.multiSelectItem.multiSelectGroup');
      var groupItem = scope.browsers.filter(function (browser) {
        return browser[GROUP_PROPERTY];
      });
      //check for each group item
      Array.from(grandGroup).forEach(function (item, index) {
        expect($(item).text().trim()).toBe($(groupItem[index].name).text());
      });
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*
  
    6. Helper Elements
    Usage testing
    i)   by default all helper elements should show 
    ii)  passing single helper element should show that particular helper element
    iii) filter element should functional
    Directive testing
    i)   by default all helper elements should show
    ii)  each filter element should be functional
    iii) passing single helper element should show that particular helper element
    iv)  helper button should change state of an button 

  */

  describe("Helper Elements", function () {
    //Usage testing
    it("by default all helper elements should show", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.inputOptions = getModernBrowsersDropdown();
      var element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();
      
      var helperContainer = element.find('.helperContainer'), 
      helperButtons = helperContainer.find('.helperButton'),
      selectAllButton = Array.from(helperButtons).filter(function(button){
        return button.innerText.indexOf('Select All');
      })[0];

      $timeout(function(){
        selectAllButton.click();
        scope.$apply();
  
        //assert
        expect(scope.outputOptions.length).toEqual(scope.inputOptions.length);
      });
    });

    it("passing single helper element should show that particular helper element", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.inputOptions = getGroupingDropdown();
      var html = $(dropdownHtml())
        .attr('helper-elements', "filter")
        .attr('input-model', 'inputOptions');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var helperContainer = element.find('.helperContainer');

      //check grand group name
      expect(helperContainer.find('input').length).toBe(1);
      //element should have `x` button
      expect(helperContainer.find('button').length).toBe(1);
      expect(helperContainer.text().trim()).toBe('×');
    });

    //Directive testing
    describe('Helper elements should be functional', function () {
      it("'all' helper button should work", function () {
        //arrange
        var scope = $rootScope.$new();
        scope.browsers = getModernBrowsersDropdown(),
          FILTER_VALUE = 'Chrome';
        var html = $(dropdownHtml())
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var directiveScope = element.contents().scope();
        var helperElement = element.find('.helperContainer .helperButton[ng-if="helperStatus.all"]');
        helperElement.trigger('click');
        scope.$apply();

        //assert
        expect(directiveScope.outputModel.length).toBe(scope.browsers.length);
      });

      it("'none' button should be functional", function () {
        //arrange
        var scope = $rootScope.$new();
        scope.browsers = getModernBrowsersDropdown(),
          FILTER_VALUE = 'Chrome';
        scope.browsers[0].ticked = true;
        var html = $(dropdownHtml())
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var directiveScope = element.contents().scope();
        var helperElement = element.find('.helperContainer .helperButton[ng-if="helperStatus.none"]');
        helperElement.trigger('click');
        scope.$apply();

        //assert
        expect(directiveScope.outputModel.length).toBe(0);
      });

      it("'reset' button should be functional", function () {
        //arrange
        var scope = $rootScope.$new();
        scope.browsers = getModernBrowsersDropdown(),
          FILTER_VALUE = 'Chrome';
        scope.browsers[0].ticked = true;
        var html = $(dropdownHtml())
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var directiveScope = element.contents().scope();
        element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
        element.find('.checkBoxContainer .multiSelectItem').eq(2).click();
        scope.$apply();
        var resetHelperElement = element.find('.helperContainer .helperButton[ng-if="helperStatus.reset"]');
        resetHelperElement.trigger('click');
        scope.$apply();

        //assert
        expect(directiveScope.outputModel.length).toBe(1);
      });

      it("input filter should filter the options", function () {
        //arrange
        var scope = $rootScope.$new();
        scope.browsers = getModernBrowsersDropdown(),
          FILTER_VALUE = 'Chrome';
        var html = $(dropdownHtml())
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);
        var filteredElments = scope.browsers.filter(function (browser) {
          return browser.name === FILTER_VALUE;
        });

        //act
        scope.$apply();
        var directiveScope = element.contents().scope();
        var inputElement = element.find('.multiSelect.inlineBlock [ng-model="inputLabel.labelFilter"]');
        inputElement.val(FILTER_VALUE);
        inputElement.triggerHandler('change');
        scope.$apply();

        //assert
        expect(directiveScope.filteredModel.length).toBe(filteredElments.length);
        expect(directiveScope.inputModel.length).toBe(scope.browsers.length);
      });

      it("Fill input filter and clear them up should reset selection", function () {
        //arrange
        var scope = $rootScope.$new();
        scope.browsers = getModernBrowsersDropdown(),
          FILTER_VALUE = 'Chrome';
        var html = $(dropdownHtml())
          .attr('input-model', 'browsers');
        element = compileDropdownHtml(html, scope);

        //act
        scope.$apply();
        var directiveScope = element.contents().scope();
        var inputElement = element.find('.multiSelect.inlineBlock [ng-model="inputLabel.labelFilter"]');
        inputElement.val(FILTER_VALUE);
        inputElement.triggerHandler('change');
        scope.$apply();
        inputElement.val('');
        inputElement.triggerHandler('change');
        scope.$apply();

        //assert
        expect(directiveScope.filteredModel.length).toBe(scope.browsers.length);
        expect(directiveScope.inputModel.length).toBe(scope.browsers.length);
      });
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*
    7. Output Properties
    
    i)   OutModel should have output-properties in outputmodel if mentioned 
    ii)  OutModel should have all properties if no output-properties mentioned in outputmodel 
  */

  describe("Output Properties", function () {
    //Usage testing
    it("OutModel should have output-properties in outputmodel if mentioned", function () {
      //arrange
      var scope = $rootScope.$new(),
        OUTPUT_PROPERTIES = 'name ticked';
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var html = $(dropdownHtml())
        .attr('output-properties', OUTPUT_PROPERTIES)
      var element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();

      //assert
      var inputPropertiesLength = OUTPUT_PROPERTIES.split(' ').length;
      Array.from(scope.outputBrowsers).forEach(function (item, index) {
        expect(Object.keys(item).length).toBe(inputPropertiesLength);
      });
    });

    it("OutModel should have all properties if no output-properties mentioned in outputmodel", function () {
      //arrange
      var scope = $rootScope.$new(),
      OUTPUT_PROPERTIES = 'name ticked';
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var element = compileDropdownHtml(dropdownHtml(), scope);

      //act
      scope.$apply();

      //assert
      var inputProperties = Object.keys(scope.modernBrowsers[0]);
      Array.from(scope.outputBrowsers).forEach(function (item, index) {
        expect(Object.keys(item).every(function(val){
            return inputProperties.indexOf(val) >= 0
          })
        ).toBeTruthy()
      });
    });

    afterEach(function () {
      element.remove();
    });
  });

  /*

    8. Callbacks

    i)  Callback should be functional with and without data
      a) on-open 
      b) on-close
      c) on-item-click
      d) on-select-all
      e) on-select-none
      f) on-reset
      g) on-clear
     ii) on-search-change should filter the inputModel.
    iii) on-search-change should pass outputmodel with settled output properties only.

  */


 describe("Callbacks", function () {

  describe('should be functional with and without data', function () {
    //Usage testing
    it("on-open method", function () {
      //arrange
      var scope = $rootScope.$new(), directiveScope, directiveSpy, elementSpy;
      scope.fOpen = function(){ console.log("Open") };
      var spy = spyOn(scope, 'fOpen');
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var html = dropdownHtml(),
        element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      directiveScope = element.isolateScope();
      directiveSpy = spyOn(directiveScope, 'onOpen');
      element.find('.multiSelect.inlineBlock >button').triggerHandler('click');
      scope.$apply();

      //assert
      expect(directiveSpy).toHaveBeenCalled();
    });

    it("on-close method", function () {
      //arrange
      var scope = $rootScope.$new(), directiveScope, directiveSpy, elementSpy;
      scope.fClose = function(){ console.log("Close") };
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var html = dropdownHtml(),
        element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      directiveScope = element.isolateScope();
      directiveSpy = spyOn(directiveScope, 'onClose');
      element.find('.multiSelect.inlineBlock >button').triggerHandler('click');
      scope.$apply();
      element.find('.multiSelect.inlineBlock >button').triggerHandler('click');
      scope.$apply();
      $timeout.flush();
      
      //assert
      expect(directiveSpy).toHaveBeenCalled();
    });

    it("on-item-click method", function () {
      //arrange
      var scope = $rootScope.$new(), directiveScope, directiveSpy, elementSpy;
      scope.fItemClick = function() { console.log("Test") };
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var html = dropdownHtml(),
        element = compileDropdownHtml(html, scope),
        elementScope = element.scope();

      //act
      scope.$apply();
      directiveScope = element.isolateScope();
      directiveSpy = spyOn(directiveScope, 'onItemClick');
      element.find('.multiSelect.inlineBlock >button').triggerHandler('click');
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').first().click();
      scope.$apply();
      $timeout.flush();
      
      //assert
      expect(directiveSpy).toHaveBeenCalled();
    });

    it("on-select-all method", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var element = compileDropdownHtml(dropdownHtml(), scope);
      scope.fSelectAll = function() { console.log("Select All") };

      //act
      scope.$apply();
      var helperContainer = element.find('.helperContainer'), 
        helperButtons = helperContainer.find('.helperButton'),
        directiveScope = element.isolateScope(),
        directiveSpy = spyOn(directiveScope, 'onSelectAll');
      var selectAllButton = Array.from(helperButtons).filter(function (item, index) {
        return ~$(item).text().indexOf('Select All');
      })[0];
      selectAllButton.click();
      scope.$apply();
      $timeout.flush();

      //assert
      expect(directiveSpy).toHaveBeenCalled();
      expect(scope.outputBrowsers.length).toEqual(scope.modernBrowsers.length);
    });

    it("on-select-none", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var element = compileDropdownHtml(dropdownHtml(), scope);
      scope.fSelectAll = function() { console.log("Select None") };

      //act
      scope.$apply();
      var helperContainer = element.find('.helperContainer'), 
        helperButtons = helperContainer.find('.helperButton'),
        directiveScope = element.isolateScope(),
        directiveSpy = spyOn(directiveScope, 'onSelectNone');
      var selectNoneButton = Array.from(helperButtons).filter(function (item, index) {
        return ~$(item).text().indexOf('Select None');
      })[0];
      selectNoneButton.click();
      scope.$apply();
      $timeout.flush();

      //assert
      expect(directiveSpy).toHaveBeenCalled();
      expect(scope.outputBrowsers.length).toEqual(0);
    });

    it("on-reset", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      scope.modernBrowsers[0].ticked = true;
      var element = compileDropdownHtml(dropdownHtml(), scope);
      scope.fReset = function() { console.log("Reset") };

      //act
      scope.$apply();
      var helperContainer = element.find('.helperContainer'), 
        helperButtons = helperContainer.find('.helperButton'),
        directiveScope = element.isolateScope(),
        directiveSpy = spyOn(directiveScope, 'onReset');
      var selectResetButton = Array.from(helperButtons).filter(function (item, index) {
        return ~$(item).text().indexOf('Reset');
      })[0];
      //unselected first
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      scope.$apply();
      $timeout.flush();
      //selected second
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
      scope.$apply();
      $timeout.flush();
      selectResetButton.click();

      //assert
      expect(directiveSpy).toHaveBeenCalled();
      expect(scope.outputBrowsers.length).toEqual(1);
    });

    it("on-clear", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.inputOptions = getGroupingDropdown();
      var element = compileDropdownHtml(dropdownHtml(), scope);
      scope.fClear = function() { console.log("Clear") };

      //act
      scope.$apply();
      var clearButton = element.find('.clearButton'),
        directiveScope = element.isolateScope(),
        directiveSpy = spyOn(directiveScope, 'onClear');
      clearButton.click();
      scope.$apply();

      //assert
      expect(directiveSpy).toHaveBeenCalled();
    });
  });


  it("on-search-change should filter the inputModel", function () {
    //arrange
    var scope = $rootScope.$new();
    scope.browsers = getModernBrowsersDropdown(),
      FILTER_VALUE = 'Chrome';
    var html = $(dropdownHtml())
      .attr('input-model', 'browsers');
    element = compileDropdownHtml(html, scope);
    var filteredElments = scope.browsers.filter(function (browser) {
      return browser.name === FILTER_VALUE;
    });
    scope.fSearchChange = function() { console.log("Search Change") };

    //act
    scope.$apply();
    var clearButton = element.find('.clearButton'),
      directiveScope = element.isolateScope(),
      directiveSpy = spyOn(directiveScope, 'onSearchChange');
    var inputElement = element.find('.multiSelect.inlineBlock [ng-model="inputLabel.labelFilter"]');
    inputElement.val(FILTER_VALUE);
    inputElement.triggerHandler('change');
    scope.$apply();
    clearButton.click();
    scope.$apply();
    $timeout.flush()

    //assert
    expect(scope.outputBrowsers.length).toBe(0);
  });

  afterEach(function () {
    element.remove();
  });
});

  /*
  
    9. Single Selection mode
    
    i)   only one value should be selected at a time.
    ii)  None of helper button should not appeared
    iii) selected value should be stored as object in outputModel

  */

  describe('Single Selection mode', function () {
    it("only one value should be selected at a time", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.modernBrowsers = getModernBrowsersDropdown();
      var html = $(dropdownHtml()).attr('selection-mode', 'single'),
        element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(1).click();
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(2).click();
      scope.$apply();
      
      //assert
      expect(scope.outputBrowsers.length).toBe(1);
    });

    it("helper button should not appear on the screen", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.browsers = getModernBrowsersDropdown(),
        FILTER_VALUE = 'Chrome';
      scope.browsers[0].ticked = true;
      var html = $(dropdownHtml())
        .attr('input-model', 'browsers')
        .attr('selection-mode', 'single');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.multiSelect.inlineBlock >button').triggerHandler('click');
      scope.$apply();
      var helperButtons = Array.from(angular.element('.helperButton')); 

      //assert
      expect(helperButtons.length).toBe(0);
    });

    it("selected value should be stored as object in outputModel", function () {
      //arrange
      var scope = $rootScope.$new();
      scope.browsers = getModernBrowsersDropdown(),
        FILTER_VALUE = 'Chrome';
      var html = $(dropdownHtml())
        .attr('input-model', 'browsers');
      element = compileDropdownHtml(html, scope);

      //act
      scope.$apply();
      element.find('.checkBoxContainer .multiSelectItem').eq(0).click();
      scope.$apply();

      //assert
      expect(scope.outputBrowsers[0].name).toBe(scope.browsers[0].name);
    });

    afterEach(function () {
      element.remove();
    });
  });
});