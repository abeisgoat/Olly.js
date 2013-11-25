/*global window */
(function (olly, document) {
    "use strict";
    
    olly.render = function (URL) {
        var domain, field, structure, templateObj;
        
        domain = this.findDomain(URL);
        
        if (!domain) {
            return "";
        }
        
                
        structure = this.structures[domain](URL);
        templateObj = this.templates[structure.template || domain];
        
        if (typeof templateObj === "string") {
            templateObj = {markup: templateObj};
        }
        
        for (field in structure.data) {
            templateObj.markup = templateObj.markup.replace(new RegExp("{{" + field + "}}"), structure.data[field]);
        }
        
        return templateObj;
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
}(window.olly, window.document));