/*global window,module,olly,document */
(function (olly) {
    "use strict";
    
    //Inspired from https://gist.github.com/jlong/2428561
    olly.parseURL = function (URLString) {
        var document = typeof module !== 'undefined'? module.document : window.document;
        
        var cleanPathchunks, parser, pathchunks, pathchunkIndex, query, queryIndex, queryPairs, queryPair, queryString, search;
        
        parser = document.createElement('a');
        parser.href = URLString;
        
        query = {};
        cleanPathchunks = [];
        
        if (parser.search) {
            search = parser.search;
        } else {
            var splitURL = URLString.replace(/#.+/, "").split('?');
            if (splitURL.length == 2) {
                search = "?" + splitURL[1];
            }else{
                search = "";
            }
        }
 
        if (search && search[0] === "?") {
            queryString = search.slice(1, search.length);
            queryPairs = queryString.split("&");
            for (queryIndex = 0; queryIndex < queryPairs.length; queryIndex += 1) {
                queryPair = queryPairs[queryIndex].split("=");
                query[queryPair[0]] = queryPair[1];
            }
        }
        
        if (parser.pathname !== "") {
            pathchunks = parser.pathname.split("/");
            for (pathchunkIndex = 0; pathchunkIndex < pathchunks.length; pathchunkIndex += 1) {
                if (pathchunks[pathchunkIndex]) {
                    cleanPathchunks.push(pathchunks[pathchunkIndex]);
                }
            }
        }
   
        return {
            url: URLString,               // => "http://example.com:3000/pathname/?search=test#hash"
            protocol: parser.protocol,    // => "http:"
            hostname: parser.hostname,    // => "example.com"
            port: parser.port,            // => "3000"
            pathname: parser.pathname,    // => "/pathname/"
            pathchunks: cleanPathchunks,  // => ["pathname"]
            querystring: queryString,     // => "search=test"
            query: query,                 // => {search: "test"}
            hash: parser.hash,            // => "#hash"
            host: parser.host             // => "example.com:3000"
        };
    };
    
}(
    typeof module !== 'undefined' && module.exports? module.exports : window.olly
));