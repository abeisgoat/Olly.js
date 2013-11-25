/*global window, document */
(function (olly) {
    "use strict";
    
    //Inspired by Q promises, but done simpler for size
    olly.defer = function () {
        var local = {};
        
        local.promise = {
            then: function (callback) {
                local.callback = callback;
                if (local.resolved) {
                    local.finish();
                }
            }
        };
        
        local.resolve = function () {
            local.args = arguments;
            if (local.callback) {
                local.finish();
            }
            local.resolved = true;
        };
        
        local.finish = function () {
            local.callback.apply(olly, local.args);
        };
        
        return local;
    };
    
}(window.olly));