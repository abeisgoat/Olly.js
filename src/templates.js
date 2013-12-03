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
        
        speakerdeck: {
            markup: '<script async class="speakerdeck-embed" data-id="{{dataId}}" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>',
            scripts: [
                'https://speakerdeck.com/oembed.json?url={{presentationURL}}'
            ]
        }
        
    };
    
}(window.olly));