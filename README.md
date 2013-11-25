Olly
====

A JavaScript library to convert URLs into embedable HTML.

Usage
-----
After being included with a `<script>` tag, Olly exposes the `olly` object globally. This object has one important method `olly.embed`. This method takes, at a minimum, a URL from a supported service and returns the code nessacary to embed the rich media from that URL in your page. For example, a link to a Youtube video will provide you with the markup needed to embed the player in your page:

    olly.embed("https://www.youtube.com/watch?v=x-8QAFqAAJ8");
    
Will return the following markup.

    '<embed width="420" height="345" src="http://www.youtube.com/v/x-8QAFqAAJ8" type="application/x-shockwave-flash">'
    
Supported Services
------------------
* Youtube
* Github Repos
* jsFiddle
* Twitter Tweets
* Imgur
* Vimeo




*... and any other, pull requests are appreciated!*