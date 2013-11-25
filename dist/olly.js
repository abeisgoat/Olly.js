/*global window, document */
(function () {
    "use strict";
    
    var Olly = function () {
        this.murs = true;
        
        this.embed = function (URLString, element, attributes) {
            var URL, renderedObj, scriptIndex;
            
            URL = this.parseURL(URLString);
            renderedObj = this.render(URL);
            element.innerHTML = renderedObj.markup;
            
            if (renderedObj.scripts) {
                for (scriptIndex = 0; scriptIndex < renderedObj.scripts.length; scriptIndex += 1) {
                    this.loadScript(renderedObj.scripts[scriptIndex]);
                }
            }
            
            return true;
        };
        
        this.loadScript = function (src) {
            var head, script;
            head = document.getElementsByTagName('head')[0];
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            head.appendChild(script);
        };
    };
    
    window.olly = new Olly();
    
}());
/*global window, document */
(function (olly) {
    "use strict";
    
    //Inspired from https://gist.github.com/jlong/2428561
    olly.parseURL = function (URLString) {
        var cleanPathchunks, parser, pathchunks, pathchunkIndex, query, queryIndex, querypairs, querypair, querystring;
        
        parser = document.createElement('a');
        parser.href = URLString;
        //parser.href = "http://example.com:3000/pathname/?search=test#hash";
        
        query = {};
        cleanPathchunks = [];
        
        if (parser.search[0] === "?") {
            querystring = parser.search.slice(1, parser.search.length);
            querypairs = querystring.split("&");
            for (queryIndex = 0; queryIndex < querypairs.length; queryIndex += 1) {
                querypair = querypairs[queryIndex].split("=");
                query[querypair[0]] = querypair[1];
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
            querystring: parser.search,   // => "?search=test"
            query: query,                 // => {search: "test"}
            hash: parser.hash,            // => "#hash"
            host: parser.host             // => "example.com:3000"
        };
    };
    
}(window.olly));
/*global window */
(function (olly, document) {
    "use strict";
    
    olly.render = function (URL) {
        var domain, field, structure, templateObj;
        
        domain = this.findDomain(URL);
        
        if (!domain) {
            return "";
        }
        
                
        structure = this.structures[domain](URL);
        templateObj = this.templates[structure.template || domain];
        
        if (typeof templateObj === "string") {
            templateObj = {markup: templateObj};
        }
        
        for (field in structure.data) {
            templateObj.markup = templateObj.markup.replace(new RegExp("{{" + field + "}}"), structure.data[field]);
        }
        
        return templateObj;
    };
    
    olly.findDomain = function (URL) {
        var domain, domainIndex, domains;

        domains = URL.hostname.split('.');
        
        for (domainIndex in domains) {
            domain = domains[domainIndex];
            if (this.structures[domain] !== undefined) {
                break;
            }
        }
        
        if (!domain) { return false; }
        
        return domain;
    };
}(window.olly, window.document));
/*global window */
(function (olly) {
    "use strict";

    olly.structures = {
        // Youtube.com Video Structure
        youtube: function (URL) {
            var structure = {
                data: {
                    embedURL: 'http://www.youtube.com/v/' + URL.query.v
                }
            };
            return structure;
        },
        
        // Vimeo.com Video Structure
        vimeo: function (URL) {
            var structure = {
                data: {
                    embedURL: '//player.vimeo.com/video/' + URL.pathchunks[0]
                }
            };
            return structure;
        },
        
        // Imgur Image Structure
        imgur: function (URL) {
            var structure = {
                data: {
                    embedURL: 'http://i.imgur.com/' + URL.pathchunks[0] + '.gif'
                }
            };
            return structure;
        },
        
        // jsFiddle IDE/Editor Structure
        jsfiddle: function (URL) {
            var structure = {
                data: {
                    embedURL: 'http://jsfiddle.net/' + URL.pathchunks.join('/') + '/embedded/'
                }
            };
            return structure;
        },
        
        // Twitter Structure
        twitter: function (URL) {
            var template, structure;
            template = URL.pathchunks.length === 1 ? "twitter_timeline" : "twitter_tweet";
            structure = {
                template: template,
                data: {
                    embedURL: URL.url
                }
            };
            return structure;
        },
    
        // Github Repo Structure
        github: function (URL) {
            var structure = {
                data: {
                    repo: URL.pathchunks.join('/')
                }
            };
            return structure;
        }
    };
    
}(window.olly));
/*global window */
(function (olly) {
    "use strict";

    olly.templates = {
        youtube: '<embed width="420" height="345" src="{{embedURL}}" type="application/x-shockwave-flash"></embed>',
        vimeo: '<iframe src="{{embedURL}}" width="420" height="345" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
        imgur: '<img src="{{embedURL}}" />',
        jsfiddle: '<iframe style="width: 100%; height: 300px" src="{{embedURL}}"></iframe>',
        twitter_tweet: {
            markup: '<blockquote class="twitter-tweet" lang="en"><p> <a href="{{embedURL}}"></a></blockquote>',
            scripts: ['//platform.twitter.com/widgets.js']
        },
        twitter_timeline: {
            markup: '<a class="twitter-timeline" href="{{embedURL}}"></a>',
            scripts: ['//platform.twitter.com/widgets.js']
        },
        github: {
            markup: '<div class="github-widget" data-repo="{{repo}}"></div>',
            scripts: [
                'https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
                'https://raw.github.com/abeisgreat/GitHub-jQuery-Repo-Widget/master/jquery.githubRepoWidget.js'
            ]
        }
    };
    
}(window.olly));