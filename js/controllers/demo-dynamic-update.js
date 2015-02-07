myApp.controller( 'demoDynamicUpdate' , [ '$scope' , function ($scope) {               

    // This will be our input model
    $scope.dynamicData = [];

    // Just a function to switch the model
    $scope.switchSource = function( data ) {
        $scope.dynamicData = angular.copy( $scope[ data ] );
    }    

    // Modern browsers
    $scope.modernBrowsers = [
        { 
            icon: '<img src="https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png" />',                         
            name: 'Opera',              
            maker: 'Opera Software',        
            ticked: true    
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
            ticked: true    
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
            ticked: true    
        }    
    ];

    // Old browsers
    $scope.oldBrowsers = [
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

    // Initially we'll use the modern browsers
    $scope.switchSource( 'modernBrowsers' );
}]);
