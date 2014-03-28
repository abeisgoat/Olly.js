var test = require('tape');
var olly = require('../dist/olly.js');

olly.ready(function () {
    test('Olly.parseURL', function (t) {
        var URL = olly.parseURL("http://example.com:3000/pathname/?search=test&cat=hat#hash");
        
        t.plan(10);
        t.equal(URL.url, 'http://example.com:3000/pathname/?search=test&cat=hat#hash', "Parsed URL");
        t.equal(URL.protocol, 'http:', "Parsed Protocol");
        t.equal(URL.hostname, 'example.com', "Parsed Hostname");
        t.equal(URL.port, '3000', "Parsed Post");
        t.equal(URL.pathname, '/pathname/', "Parsed Pathname");
        t.looseEqual(URL.pathchunks, ['pathname'], "Parsed Path Chunks");
        t.looseEqual(URL.querystring, "search=test&cat=hat", "Parsed Query String");
        t.looseEqual(URL.query, {search: 'test', cat: 'hat'}, "Parsed Query Object");
        t.equal(URL.hash, '#hash', "Parsed Hash Fragment");
        t.equal(URL.host, 'example.com:3000', "Parsed Host");
    });
});

