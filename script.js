var app = angular.module('amsTest', ['multi-select']);

app.controller('amsController', ['$scope', function($scope) {

	$scope.modernWebBrowsers = [
	    { icon: "<img src='https://cdn1.iconfinder.com/data/icons/fatcow/32/opera.png' />",               name: "Opera",              maker: "(Opera Software)",        ticked: true  },
	    { icon: "<img src='https://cdn1.iconfinder.com/data/icons/fatcow/32/internet_explorer.png' />",   name: "Internet Explorer",  maker: "(Microsoft)",             ticked: false },
	    { icon: "<img src='https://cdn1.iconfinder.com/data/icons/fatcow/32/firefox.png' />",        	  name: "Firefox",            maker: "(Mozilla Foundation)",    ticked: true  },
	    { icon: "<img src='https://cdn1.iconfinder.com/data/icons/fatcow/32x32/safari_browser.png' />",      	      name: "Safari",             maker: "(Apple)",                 ticked: false },
	    { icon: "<img src='https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/32/chrome.png' />",              name: "Chrome",             maker: "(Google)",                ticked: true  }
	]; 

}]);