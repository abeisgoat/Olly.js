/*global window */
(function (olly) {
    "use strict";

    olly.templates = {
        youtube: '<embed width="420" height="345" src="{{embedURL}}" type="application/x-shockwave-flash"></embed>',
        
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
    
}(window.olly));