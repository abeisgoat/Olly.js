/*global window, document */
(function () {
    "use strict";
    
    var Olly = function () {
        this.murs = true;
        
        this.embed = function (URLString, element, attributes) {
            var URL, renderedObj;
            
            URL = this.parseURL(URLString);
            this.render(element, URL);
            
            return true;
        };
    };
    
    window.olly = new Olly();
    
}());