/*global window,module,olly,document */
(function () {
    "use strict";

    var Olly = function () {
        var self = this;

        self.murs = true;
        self.TEXT = 0;
        self.LINK = 1;
        self.EMBED = 2;
        self.onReady = null;

        self.ready = function (callback) {
            if (callback) {
                self.onReady = callback;
            }else if (typeof self.onReady === 'function') {
                self.onReady();
            }
        };

        self.embed = function (URLString, element, services) {
            var URL;

            URL = this.parseURL(URLString);
            this.render(element, URL, services);

            return true;
        };

        self.richify = function (blob, parentElement, services) {
            var elements, otbIndex, OTB;

            var URLRegex = /(http(?:s?):[^ <\n]+)/;
            var TagRegex = /<.+?>/g;
            var OutsideTagRegex = />(.+?)(<|$)/g;

            // Remove all tags from blob so we don't end up
            // trying to put an embeded player in an <a> tag
            var text = blob.replace(TagRegex, ' ');

            // Then pull out all the URLS
            var URLs = text.match(URLRegex) || [];

            // We use OutsideTagBlobs to provide context to the
            // URL replaces, so we don't accidently replace URLs
            // in attributes and whatnot
            var OTBs = blob.match(OutsideTagRegex) || [];
            var nOTBs = [];

            for (var urlIndex=0; urlIndex<URLs.length; urlIndex++) {
                var url = URLs[urlIndex];
                for (otbIndex=0; otbIndex<OTBs.length; otbIndex++) {
                    OTB = OTBs[otbIndex];
                    nOTBs.push(OTB.replace(url, "<span class='olly'>" + url + "</span>"));
                }
            }

            console.log(OTBs)

            for (otbIndex=0; otbIndex<OTBs.length; otbIndex++) {
                OTB = OTBs[otbIndex];
                var nOTB = nOTBs[otbIndex];
                blob = blob.replace(OTB, nOTB);
            }

            parentElement.innerHTML = blob;
            elements = parentElement.getElementsByClassName("olly");

            for (var elementIndex=0; elementIndex<elements.length; elementIndex++) {
                var element = elements[elementIndex];
                var URL = this.parseURL(element.innerHTML);
                this.render(element, URL, services);
            }

            return true;
        };
    };

    if (typeof module !== 'undefined' && module.exports) {
        // We use a fake DOM here so we can still parse/render correctly
        var jsdom = require("jsdom");
        module.exports = new Olly();
        jsdom.env("<html><body></body></html>", function (errors, window) {
            module.document = window.document;
            module.exports.ready();
        });
    } else {
        window.olly = new Olly();
        window.olly.ready();
    }

}());

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

/*global window */
(function (olly) {
    "use strict";

    olly.templates = {
        youtube: '<iframe width="560" height="315" src="{{embedURL}}" frameborder="0" allowfullscreen></iframe>',

        vimeo: '<iframe src="{{embedURL}}" width="420" height="345" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',

        dotsub: '<iframe src="{{embedURL}}" frameborder="0" width="420" height="345"></iframe> ',

        dailymotion: '<iframe frameborder="0" width="420" height="345" src="{{embedURL}}" allowfullscreen></iframe>',

        liveleak: '<embed width="420" height="345" src="{{embedURL}}" type="application/x-shockwave-flash" wmode="transparent"></embed>',

        vine: '<iframe class="vine-embed" src="{{embedURL}}" width="420" height="345" frameborder="0"></iframe><script async src="//platform.vine.co/static/scripts/embed.js" charset="utf-8"></script>',

        ted: '<iframe src="{{embedURL}}" width="420" height="345" frameborder="0" scrolling="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',

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
                'http://abeisgreat.github.io/Github-Repo-Widget/githubRepoWidget.min.js'
            ]
        },

        reddit: {
            scripts: [
                "{{JSONPURL}}?limit=5&callback={{callbackName}}"
            ]
        },

        soundcloud: '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url={{embedURL}}"></iframe>',

        spotify: '<iframe src="https://embed.spotify.com/?uri=spotify:track:{{embedID}}" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>',

        twitch: '<object type="application/x-shockwave-flash" height="378" width="620" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel={{channel}}" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel={{channel}}&auto_play=true&start_volume=25" /></object>',

        gfycat: {
            markup: '<img class="gfyitem" data-id="{{embedID}}" />',
            scripts: [
                'http://assets.gfycat.com/js/gfyajax-0.517d.js'
            ]
        },

        video: {
            markup: '<video src="{{embedURL}}" controls="true" autoplay loop></video>'
        },

        audio: {
            markup: '<audio src="{{embedURL}}" controls="true"></audio>'
        },

        image: {
            markup: '<img src="{{embedURL}}" />'
        }
    };

}(typeof module !== 'undefined' && module.exports? module.exports : window.olly));

/*global window,module,olly */
(function (olly) {
    "use strict";

    olly.domains = {
        // Youtube.com Video Structure
        youtube: function (URL) {
            var structure = {
                data: {
                    embedURL: 'http://www.youtube.com/embed/' + URL.query.v
                }
            };
            return structure;
        },

        // Youtu.be Video Structure
        youtu: function (URL) {
            var structure = {
                template: 'youtube',
                data: {
                    embedURL: 'http://www.youtube.com/embed/' + URL.pathname.slice(1, URL.pathname.length)
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

        // Dotsub.com Video Structure
        dotsub: function (URL) {
            var structure = {
                data: {
                   embedURL: '//dotsub.com/media/' + URL.pathchunks[1] + '/embed/'
                }
            };
            return structure;
        },

        // Dailymotion.com Video Structure
        dailymotion: function (URL) {
            var structure = {
                data: {
                   embedURL: 'http://www.dailymotion.com/embed/video/' + URL.pathchunks[1]
                }
            };
            return structure;
        },

        // Liveleak.com Video Structure
        liveleak: function (URL) {
            var structure = {
                data: {
                   embedURL: 'http://www.liveleak.com/e/' + URL.query.i
                }
            };
            return structure;
        },

        // Vine.com Video Structure
        vine: function (URL) {
            var structure = {
                data: {
                   embedURL: 'https://vine.co/v/' + URL.pathchunks[1] + '/embed/simple'
                }
            };
            return structure;
        },

        // Ted.com Video Structure
        ted: function (URL) {
            var structure = {
                data: {
                   embedURL: 'http://embed.ted.com/talks/' + URL.pathchunks[1] + '.html'
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
        },

        // Reddit Repo Structure
        reddit: function (URL) {
            var deferred, structure, callbackName, template, JSONPURL;

            callbackName = '_reddit_' + URL.pathchunks[1];
            template = URL.pathchunks.indexOf("user") != -1 ? "reddit_user" : "reddit_subreddit";

            if (template == "reddit_subreddit") {
                JSONPURL = 'http://www.reddit.com/r/' + URL.pathchunks[1] + '/hot/.embed';
            }

            if (template == "reddit_user") {
                JSONPURL = 'http://www.reddit.com/user/' + URL.pathchunks[1] + '/submitted.embed';
            }

            deferred = olly.defer();
            window[callbackName] = function (markup) {
                deferred.resolve({markup: markup});
            };

            structure = {
                templatePromise: deferred.promise,
                data: {
                    JSONPURL: JSONPURL,
                    callbackName: callbackName
                }
            };
            return structure;
        },

        // Soundcloud Structure
        soundcloud: function (URL) {
            return {
                data: {
                    embedURL: URL.url
                }
            };
        },

        // Spotify Structure
        spotify: function (URL) {
            return {
                data: {
                    embedID: URL.pathchunks[1]
                }
            };
        },


        // Twitch Structure
        twitch: function (URL) {
            return {
                data: {
                    channel: URL.pathchunks[0]
                }
            };
        },

        // Gfycat Structure
        gfycat: function (URL) {
            return {
                data: {
                    embedID: URL.pathchunks[0]
                }
            };
        }
    };

}(typeof module !== 'undefined' && module.exports? module.exports : window.olly));

/*global window,module,olly */
(function (olly) {
    "use strict";

    olly.extensions = {
        // Image Structure
        "image": function (URL) {
            return {
                template: 'image',
                data: {
                    embedURL: URL.url
                }
            };
        },

        // HTML5 Video Structure
        "video": function (URL) {
            return {
                template: 'video',
                data: {
                    embedURL: URL.url
                }
            };
        },

        // HTML5 Video Structure
        "audio": function (URL) {
            return {
                template: 'audio',
                data: {
                    embedURL: URL.url
                }
            };
        }
    };

    olly.extensions.jpg = olly.extensions.image;
    olly.extensions.jpeg = olly.extensions.image;
    olly.extensions.png = olly.extensions.image;
    olly.extensions.gif = olly.extensions.image;
    olly.extensions.bmp = olly.extensions.image;

    olly.extensions.mp4 = olly.extensions.video;
    olly.extensions.ogv = olly.extensions.video;
    olly.extensions.webm = olly.extensions.video;

    olly.extensions.ogg = olly.extensions.audio;
    olly.extensions.mp3 = olly.extensions.audio;

}(typeof module !== 'undefined' && module.exports? module.exports : window.olly));

/*global window,module,olly,document */
(function (olly, document) {
    "use strict";

    olly.render = function (element, URL, services) {
        var src, definition, domainName, extensionName, field, templateObj, scriptIndex;

        domainName = this.findDomain(URL);
        extensionName = this.findExtension(URL);

        if ((!domainName && !extensionName) || (services || {})[domainName] == olly.TEXT) {
            return "";
        }

        definition = (this.domains[domainName] || this.extensions[extensionName])(URL);
        templateObj = this.templates[definition.template || domainName || extensionName];

        if (templateObj && templateObj.scripts) {
            for (scriptIndex = 0; scriptIndex < templateObj.scripts.length; scriptIndex += 1) {
                src = templateObj.scripts[scriptIndex];
                this.loadScript(element, olly.generate(src, definition.data));
            }
        }

        if (definition.templatePromise) {
            definition.templatePromise.then(function (templateObj) {
                this.display(templateObj, definition.data, element);
            });
        } else {
            this.display(templateObj, definition.data, element);
        }

        return true;
    };

    olly.findDomain = function (URL) {
        var domainName, domainNameIndex, domainNames;

        domainNames = URL.hostname.split('.');

        for (domainNameIndex in domainNames) {
            domainName = domainNames[domainNameIndex];
            if (this.domains[domainName] !== undefined) {
                break;
            }
        }

        if (!this.domains[domainName]) { return false; }

        return domainName;
    };

    olly.findExtension = function (URL) {
        var extensionName, splitPath;

        splitPath = URL.pathname.split('.');
        extensionName = splitPath[splitPath.length-1];

        return this.extensions[extensionName]? extensionName : false;
    };

    olly.load = function (src) {
        var deferred = olly.defer();

        function reqListener (res) {
            deferred.resolve(res.responseText);
        }

        var xhr = new XMLHttpRequest();
        xhr.onload = reqListener;
        xhr.open("get", src, true);
        xhr.send();

        return deferred.promise;
    };

    olly.loadScript = function (element, src) {
        var script;
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        element.appendChild(script);
    };

    olly.display = function (templateObj, data, element) {
        if (typeof templateObj === "string") {
            templateObj = {markup: templateObj};
        }
        element.innerHTML = olly.generate(templateObj.markup, data);
    };

    olly.generate = function (template, data) {
        var field, output;
        output = template;
        for (field in data) {
            output = output.replace(new RegExp("{{" + field + "}}", "g"), data[field]);
        }
        return output;
    };
}(
    typeof module !== 'undefined' && module.exports? module.exports : window.olly,
    typeof module !== 'undefined'? module.document : document
));

/*global window,module,olly */
(function (olly) {
    "use strict";

    //Inspired by Q promises, but done simpler for size
    olly.defer = function () {
        var local = {};

        local.promise = {
            then: function (callback) {
                local.callback = callback;
                if (local.resolved) {
                    local.finish();
                }
            }
        };

        local.resolve = function () {
            local.args = arguments;
            if (local.callback) {
                local.finish();
            }
            local.resolved = true;
        };

        local.finish = function () {
            local.callback.apply(olly, local.args);
        };

        return local;
    };

}(typeof module !== 'undefined' && module.exports? module.exports : window.olly));
