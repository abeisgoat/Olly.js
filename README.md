Olly.js (1.0)
=======

A JavaScript library to convert URLs into embedable HTML.

Example
-------

[Live Demo](http://abehaskins.github.io/Olly.js/markup/example.html)

Usage
-----
Instal with bower or download dist/olly.js

    bower install Olly.js

After being included with a `<script>` tag, Olly exposes the `olly` object (weird, right?). This object has one important method `olly.embed` The `.embed` method takes, at a minimum, a URL from a supported service and a DOM element. The method then fills the provided element with the rich media from the provided URL. For example, a link to a Youtube video will fill the provided element with an embedded Youtube player for the video:

```js
olly.embed("https://www.youtube.com/watch?v=x-8QAFqAAJ8", document.getElementById("youtube"));
```

This will fill `#youtube` with the following markup.

```html
<embed width="420" height="345" src="http://www.youtube.com/v/x-8QAFqAAJ8" type="application/x-shockwave-flash">
```

These methods can both take an optional `services` argument which allows you to specify which types of URLs should be embedded. For example, if we only want Youtube videos to be embedded, we can do this:

```js
olly.embed("https://www.youtube.com/watch?v=x-8QAFqAAJ8", document.getElementById("blog-post"), {youtube: olly.EMBED});
```

Contributing
------------
If you're looking to add a service to Olly.js, please include the following changes in your pull:

* The modified sources for Olly.js which integrate the service.
* An example added to markup/examples.html.
* A change to the README listing the new service under Supported Services.

Supported Services
------------------

**Video**

* Youtube
* Vimeo
* Twitch.TV
* Dotsub
* Dailymotion
* LiveLeak
* Vine
* TED

**Audio**

* Soundcloud
* Spotify

**Images**

* Imgur
* Gfycat

**Social**

* Reddit Subreddits and Users
* Twitter Tweets

**Other**

* Github Repos
* jsFiddle

Supported File Types
------------------

**Video**

* MP4
* WebM
* OGV

**Images**

* JPG
* PNG
* BMP
* GIF

**Audio**

* MP3
* OGG

*... and any other you want to implement, pull requests are appreciated!*
