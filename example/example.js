/**
 * Created by pr on 13.12.2014.
 */
angular.module('angular-multi-select-example', ['multi-select'])
       .controller('exampleController', ['$scope', function($scope){

        $scope.modernWebBrowsers = [{ name: "Opera",              maker: "(Opera Software)",        ticked: true  },
            { name: "Internet Explorer",  maker: "(Microsoft)",             ticked: false },
            { name: "Firefox",            maker: "(Mozilla Foundation)",    ticked: true  },
            { name: "Safari",             maker: "(Apple)",                 ticked: false },
            { name: "Chrome",             maker: "(Google)",                ticked: true  }];

    }]);

