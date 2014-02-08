/*global window */
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
    
}(window.olly));