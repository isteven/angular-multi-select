'use strict'; 

var myApp = angular.module( 'myApp' , [ 
    'ngRoute',
    'isteven-multi-select'
])
.config([ '$routeProvider', function( $routeProvider ) {          

    $routeProvider.when( '/main' , {
        templateUrl: 'views/main.htm', 
        controller: 'demoMinimum'
    });

    $routeProvider.when( '/getting-started' , {
        templateUrl: 'views/getting-started.htm'
    });

    $routeProvider.when( '/configs-options' , {
        templateUrl: 'views/configs-options.htm', 
    });        

    $routeProvider.when( '/demo-minimum' , {
        templateUrl: 'views/demo-minimum.htm', 
        controller: 'demoMinimum'
    });        

    $routeProvider.when( '/demo-horizontal-layout' , {
        templateUrl: 'views/demo-horizontal-layout.htm', 
        controller: 'demoHorizontalLayout'
    });        

    $routeProvider.when( '/demo-dynamic-update' , {
        templateUrl: 'views/demo-dynamic-update.htm', 
        controller: 'demoDynamicUpdate'
    });        

    $routeProvider.when( '/demo-disabling-enabling' , {
        templateUrl: 'views/demo-disabling-enabling.htm', 
        controller: 'demoDisablingEnabling'
    });        

    $routeProvider.when( '/demo-grouping' , {
        templateUrl: 'views/demo-grouping.htm', 
        controller: 'demoGrouping'
    });        

    $routeProvider.when( '/demo-output-properties' , {
        templateUrl: 'views/demo-output-properties.htm', 
        controller: 'demoMinimum'
    });        

    $routeProvider.when( '/demo-helper-elements' , {
        templateUrl: 'views/demo-helper-elements.htm', 
        controller: 'demoMinimum'
    });            

    $routeProvider.when( '/demo-callbacks' , {
        templateUrl: 'views/demo-callbacks.htm', 
        controller: 'demoCallbacks'
    });        

    $routeProvider.when( '/demo-single-selection-mode' , {
        templateUrl: 'views/demo-single-selection-mode.htm', 
        controller: 'demoSingleSelectionMode'
    });            

    $routeProvider.when( '/dependency-compatibility' , {
        templateUrl: 'views/dependency-compatibility.htm'
    });

    $routeProvider.when( '/issues-bug-reporting' , {
        templateUrl: 'views/issues-bug-reporting.htm'
    });

    $routeProvider.when( '/contributing' , {
        templateUrl: 'views/contributing.htm'
    });
    

    $routeProvider.when( '/breaking-changes' , {
        templateUrl: 'views/breaking-changes.htm'
    });    
    
    $routeProvider.when( '/faq' , {
        templateUrl: 'views/faq.htm'
    });
    
    $routeProvider.when( '/mit-license' , {
        templateUrl: 'views/mit-license.htm'
    });

    $routeProvider.when( '/other-cool-stuffs' , {
        templateUrl: 'views/other-cool-stuffs.htm'
    });
    

    $routeProvider.otherwise( {
        redirectTo: '/main'
    });

}]);

