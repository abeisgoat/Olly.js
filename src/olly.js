/*global window,module,olly,document */
(function () {
    "use strict";
    
    var Olly = function () {
        this.murs = true;
        this.TEXT = 0;
        this.LINK = 1;
        this.EMBED = 2;
        
        this.embed = function (URLString, element, services) {
            var URL;
            
            URL = this.parseURL(URLString);
            this.render(element, URL, services);
            
            return true;
        };
        
        this.richify = function (blob, parentElement, services) {
            var elements, otbIndex, OTB;
            
            var URLRegex = /(http(?:s?):[^ <\n]+)/;
            var TagRegex = /<.+?>/g;
            var OutsideTagRegex = />(.+?)</g;
            
            // Remove all tags from blob so we don't end up
            // trying to put an embeded player in an <a> tag
            var text = blob.replace(TagRegex, ' ');
            
            // Then pull out all the URLS
            var URLs = text.match(URLRegex);
            
            // We use OutsideTagBlobs to provide context to the
            // URL replaces, so we don't accidently replace URLs
            // in attributes and whatnot
            var OTBs = blob.match(OutsideTagRegex);
            var nOTBs = [];
            
            for (var urlIndex=0; urlIndex<URLs.length; urlIndex++) {
                var url = URLs[urlIndex];
                for (otbIndex=0; otbIndex<OTBs.length; otbIndex++) {
                    OTB = OTBs[otbIndex];
                    nOTBs.push(OTB.replace(url, "<span class='olly'>" + url + "</span>"));
                }   
            }

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
        module.exports = new Olly();
        var jsdom = require("jsdom");
        module.document = jsdom.jsdom("<html><body></body></html>", jsdom.level(1, "core"));
    } else {
        window.olly = new Olly();
    }
    
}());