/*global window,module,olly,document */
(function (olly, document) {
    "use strict";

    olly.render = function (element, URL, services) {
        var src, definition, domainName, extensionName, field, templateObj, scriptIndex;

        domainName = this.findDomain(URL);
        extensionName = this.findExtension(URL);

        if ((!domainName && !extensionName) || (services || {})[domainName] == olly.TEXT) {
            return "";
        }

        definition = (this.domains[domainName] || this.extensions[extensionName])(URL);
        templateObj = this.templates[definition.template || domainName || extensionName];

        if (templateObj && templateObj.scripts) {
            for (scriptIndex = 0; scriptIndex < templateObj.scripts.length; scriptIndex += 1) {
                src = templateObj.scripts[scriptIndex];
                this.loadScript(element, olly.generate(src, definition.data));
            }
        }

        if (definition.templatePromise) {
            definition.templatePromise.then(function (templateObj) {
                this.display(templateObj, definition.data, element);
            });
        } else {
            this.display(templateObj, definition.data, element);
        }

        return true;
    };

    olly.findDomain = function (URL) {
        var domainName, domainNameIndex, domainNames;

        domainNames = URL.hostname.split('.');

        for (domainNameIndex in domainNames) {
            domainName = domainNames[domainNameIndex];
            if (this.domains[domainName] !== undefined) {
                break;
            }
        }

        if (!this.domains[domainName]) { return false; }

        return domainName;
    };

    olly.findExtension = function (URL) {
        var extensionName, splitPath;

        splitPath = URL.pathname.split('.');
        extensionName = splitPath[splitPath.length-1];

        return this.extensions[extensionName]? extensionName : false;
    };

    olly.load = function (src) {
        var deferred = olly.defer();

        function reqListener (res) {
            deferred.resolve(res.responseText);
        }

        var xhr = new XMLHttpRequest();
        xhr.onload = reqListener;
        xhr.open("get", src, true);
        xhr.send();

        return deferred.promise;
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
            output = output.replace(new RegExp("{{" + field + "}}", "g"), data[field]);
        }
        return output;
    };
}(
    typeof module !== 'undefined' && module.exports? module.exports : window.olly,
    typeof module !== 'undefined'? module.document : document
));
