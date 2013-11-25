/*global window */
(function (olly, document) {
    "use strict";
    
    olly.render = function (element, URL) {
        var src, domain, field, structure, templateObj, scriptIndex;
        
        domain = this.findDomain(URL);
        
        if (!domain) {
            return "";
        }
        
        structure = this.structures[domain](URL);
        templateObj = this.templates[structure.template || domain];
        
        if (templateObj.scripts) {
            for (scriptIndex = 0; scriptIndex < templateObj.scripts.length; scriptIndex += 1) {
                src = templateObj.scripts[scriptIndex];
                this.loadScript(element, olly.generate(src, structure.data));
            }
        }
        
        if (structure.templatePromise) {
            structure.templatePromise.then(function (templateObj) {
                this.display(templateObj, structure.data, element);
            });
        } else {
            this.display(templateObj, structure.data, element);
        }
        
        return true;
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
            output = output.replace(new RegExp("{{" + field + "}}"), data[field]);
        }
        return output;
    };
}(window.olly, window.document));