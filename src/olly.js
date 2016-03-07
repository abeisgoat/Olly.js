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

        self.embed = function (URLString, elementOrReturn, services) {
            var URL, renderResults;

            URL = this.parseURL(URLString);
            renderResults = this.render(elementOrReturn, URL, services);

            return (typeof renderResults === "boolean") ? true : renderResults;
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
