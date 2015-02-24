myApp.controller( 'demoGrouping' , [ '$scope' , function ($scope) {               

    // Modern web browsers with groups
    $scope.webBrowsersGrouped = [
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
        },
        {
            msGroup: false
        },
        {
            msGroup: false
        }
    ];    
}]);
