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