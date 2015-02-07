myApp.run( function( $rootScope ) {   
    $rootScope.removeHost = function( url )
    {
        if ( url ) {
            var r = /[^/\\]+(?:jpg|gif|png)/gi;
            return '[...]/' + url.match( r )[0] + '...';
        }
    }    
});

