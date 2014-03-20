/*global window */
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
    
}(window.olly));